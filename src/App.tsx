import { useState, useEffect, useRef } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Switch,
  Stack,
  TextField,
  Grid2 as Grid,
  Popover,
  Typography,
  Paper,
} from '@mui/material'
import { useHotkeys } from 'react-hotkeys-hook'
import removeAccents from 'remove-accents'
import useMediaQuery from '@mui/material/useMediaQuery';
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import { ThemeProvider, createTheme } from '@mui/material/styles';

// polyfill for Set.prototype.union for older Safari
import 'core-js/actual/set'

import {
  TEMPS,
  VERBES,
  VERBE_MENU,
  PERSONNES,
  chooseRandom,
  conjugate,
} from './conjugation.tsx'

import './App.css'


function expandAliases(values) {
  let expandedValues = new Set()
  for (const value of values) {
    if (value.expand !== undefined) {
      expandedValues = expandedValues.union(value.expand)
    } else {
      expandedValues.add(value)
    }
  }
  return Array.from(expandedValues)
}

const Key = ({ children }) => <span className="key">{children}</span>
const formatTemps = (mode, temps) => mode == "indicatif" ? temps : `${mode} ${temps}`

function App() {

  const [currentConjugation, setCurrentConjugation] = useState({
    mode: "indicatif",
    temps: "présent",
    verbe: "savoir",
    personne: "nous",
    conjugé: "nous avons su",
  })

  const [UILanguage, setUILanguage] = useState("fr")
  const locale = (versions) => versions[UILanguage]


  const [selectedPersonnes, setSelectedPersonnes] = useState(PERSONNES)
  const [selectedTemps, setSelectedTemps] = useState(TEMPS.slice(0, 3))
  const [selectedVerbes, setSelectedVerbes] = useState(expandAliases(VERBE_MENU.slice(0, 1)))

  const [prononcerSwitch, setPrononcerSwitch] = useState<boolean>(false)
  const [partsSwitch, setPartsSwitch] = useState<boolean>(true)
  const [conjugéSwitch, setConjugéSwitch] = useState<boolean>(true)

  const [showParts, setShowParts] = useState<boolean>(false)
  const [showConjugé, setShowConjugé] = useState<boolean>(false)
  const [showHint, setShowHint] = useState<boolean>(false)

  const [conjugéInput, setConjugéInput] = useState<string>('x')

  function getSelectedVerbes() {
    let set = new Set()
    for (const entry of selectedVerbes) {
      if (entry.infinitif !== undefined) {
        set.add(entry.infinitif)
      } else if (entry.verbes !== undefined) {
        set = set.union(entry.verbes)
      }
    }
    if (set.size == 0) set = new Set(VERBES)
    for (const entry of selectedVerbes) {
      if (entry.only !== undefined) {
        set = set.intersection(entry.only)
      }
    }
    return set.size > 0 ? Array.from(set) : VERBES
  }


  function getSampleSpace() {
    if (selectedPersonnes.length == 0) setSelectedPersonnes(PERSONNES)
    if (selectedTemps.length == 0) setSelectedTemps(TEMPS.slice(0, 1))
    return {
      personnes: selectedPersonnes,
      temps: selectedTemps,
      verbes: getSelectedVerbes(),
    }
  }


  function prononcer(conj) {
    if (conj === undefined) conj = currentConjugation
    const filename = removeAccents(`${import.meta.env.BASE_URL}/audio/${conj.verbe}/${conj.mode}/${conj.temps}/${conj.conjugé}.mp3`).replaceAll(' ', '_')
    console.log(filename)

    const audio = new Audio(filename)
    audio.play()
  }

  function randomButton() {
    const parts = chooseRandom(getSampleSpace())
    if (parts.verbe == "falloir") {
      parts.personne = PERSONNES[2]
    }
    const conjugé = conjugate(parts)

    const conj = {
      mode: parts.temps.mode,
      temps: parts.temps.temps,
      verbe: parts.verbe,
      personne: parts.personne,
      conjugé,
    }
    setCurrentConjugation(conj)

    setShowParts(partsSwitch)
    setShowConjugé(conjugéSwitch)
    setConjugéInput(conjugéSwitch ? conj.conjugé : '')
    setShowHint(false)
    if (prononcerSwitch) prononcer(conj)
  }


  useEffect(() => randomButton(), [])

  useHotkeys('return', randomButton)
  useHotkeys('space,/,:', () => prononcer())
  useHotkeys('comma,p', () => setShowParts(!showParts))
  useHotkeys('.,c,;', () => revealAnswer(!showConjugé))


  function revealAnswer(shown) {
    setShowConjugé(shown)
    setConjugéInput(shown ? currentConjugation.conjugé : '')
  }

  const normalizeForComparison = (x: string) => x.replace(/[‘’]/, "'").toLowerCase().normalize()

  const answerIsCorrect = () => (
    normalizeForComparison(conjugéInput) == normalizeForComparison(currentConjugation.conjugé)
  )

  const theme = createTheme({
    colorSchemes: {
      dark: useMediaQuery('(prefers-color-scheme: dark)'),
    },
  })
  const helpButtonRef = useRef()
  const [showHelp, setShowHelp] = useState<boolean>(false);

  function ConjugéOverlay() {
    const classes = []
    let html
    if (answerIsCorrect()) {
      html = conjugéInput
      classes.push("correct")
    } else {
      const correct = normalizeForComparison(currentConjugation.conjugé)
      html = Array.from(conjugéInput).map((char, i) => {
        if (normalizeForComparison(char) == correct[i]) {
          return char
        } else {
          return `<span class="incorrect">${char}</span>`
        }
      }).join('')

      if (correct.length > conjugéInput.length) classes.push("incomplete")
    }

    return <div
      id="conjugé-overlay"
      className={classes}
      dangerouslySetInnerHTML={{__html: html}}
    />
  }

  return <ThemeProvider theme={theme}>
    <Stack spacing={3} id={"app-body"} className={UIFont ? "fancy" : null}>

      <h1>{locale({fr: "Conjugueur Français", en: "French conjugator"})}</h1>

      <div>
        <Button
          ref={helpButtonRef}
          onClick={() => setShowHelp(true)}>
          {locale({fr: "Aide", en: "Help"})}
        </Button>
        <Typography>🇫🇷<Switch
          checked={UILanguage == "en"}
          onChange={(event, value) => setUILanguage(value ? "en" : "fr")}
          sx={{
              filter: "saturate(0%)"
          }}
        />🇬🇧</Typography>
      </div>

      <Popover
        open={showHelp}
        anchorEl={helpButtonRef.current}
        onClose={() => setShowHelp(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Paper sx={{ p: 2 }}>

          <Typography textAlign="center">🇫🇷<Switch
              checked={UILanguage == "en"}
              onChange={(event, value) => setUILanguage(value ? "en" : "fr")}
              sx={{
                  filter: "saturate(0%)"
              }}
            />🇬🇧</Typography>

            {locale({
              fr: <>
                <h4>Instructions</h4>
                <p>
                  Le bouton ‹&nbsp;Phrase Aléatoire&nbsp;› choisit un verbe français conjugué à l'une des personnes grammaticales, modes, et temps sélectionnés dans les menus.
                </p>
                <p>
                  Les trois boutons vous permettent d'entendre la phrase, de voir le verbe et le temps, ou de révéler la phrase conjuguée.
                </p>
                <p>
                  Les trois interrupteurs permettent de contrôler ce qui est affiché immédiatement.
                  Différentes combinaisons permettent différents modes de pratique. Par exemple :
                </p>
                <ul>
                  <li>Avec ‹&nbsp;Décomposer&nbsp;› activé et ‹&nbsp;Conjuger&nbsp;› désactivé, vous pouvez vous entraîner à conjuguer en tapant dans la case et en appuyant sur <Key>entrée</Key> pour vérifier.</li>
                  <li>Lorsque l'interrupteur ‹&nbsp;Décomposer&nbsp;› est désactivé, vous pouvez vous entraîner à distinguer les temps à l'oreille (si ‹&nbsp;Prononcer&nbsp;› est activé) ou à partir de la forme conjuguée (si ‹&nbsp;Conjuger&nbsp;› est activé).</li>
                </ul>
              </>,
              en: <>
                <h4>Instructions</h4>
                <p>
                  The ‘Random Phrase’ button picks a French verb conjugated to one of the grammatical persons, moods, and tenses selected in the menus.
                </p>
                <p>
                  The three buttons allow you to hear the phrase, see the verb and tense, or reveal the conjugated phrase.
                </p>
                <p>
                  The three toggle switches control what is shown immediately.
                  Different combinations allow for different modes of practice. For example:
                </p>
                <ul>
                  <li>With ‘Show Parts’ enabled and ‘Show Conjugated’ disabled, you can practice conjugating by typing into the box and pressing <Key>return</Key> to check.</li>
                  <li>When the ‘Show Parts’ switch is disabled, you can practice distinguishing the tenses by sound (if ‘Speak’ is enabled) or from the conjugated form (if ‘Show Conjugated’ is enabled).</li>
                </ul>
              </>
            })}

          <h4>{locale({fr: "Raccourcis clavier", en: "Keyboard shortcuts"})}</h4>

          <table id="keymap">
            {locale({
              fr: <tbody>
                <tr>
                  <td><Key>retour</Key></td>
                  <td>Choisir une autre exemple</td>
                </tr>
                <tr>
                  <td><Key>,</Key> ou <Key>p</Key></td>
                  <td>Voir les parts</td>
                </tr>
                <tr>
                  <td><Key>.</Key> ou <Key>;</Key> ou <Key>c</Key></td>
                  <td>Voir la phrase conjugé</td>
                </tr>
                <tr>
                  <td><Key>espace</Key> ou <Key>/</Key></td>
                  <td>Prononcer la phrase conjugé</td>
                </tr>
              </tbody>,
              en: <tbody>
                <tr>
                  <td><Key>return</Key></td>
                  <td>Generate random example</td>
                </tr>
                <tr>
                  <td><Key>,</Key> or <Key>p</Key></td>
                  <td>See components</td>
                </tr>
                <tr>
                  <td><Key>.</Key> or <Key>;</Key> or <Key>c</Key></td>
                  <td>See conjugated phrase</td>
                </tr>
                <tr>
                  <td><Key>space</Key> or <Key>/</Key></td>
                  <td>Speak conjugated phrase</td>
                </tr>
              </tbody>,
            })}
          </table>
        </Paper>
      </Popover>


      <Autocomplete
        multiple
        disableCloseOnSelect
        options={[
          {label: locale({fr: "(sélectionner toutes)", en: "(select all)"}), expand: new Set(PERSONNES)},
          ...PERSONNES,
        ]}
        value={selectedPersonnes}
        onChange={(event, value) => setSelectedPersonnes(expandAliases(value))}
        getOptionLabel={option => option.pronom || option.label}
        renderInput={(params) => <TextField {...params} label={locale({fr: "Personnes grammaticales", en: "Grammatical person"})} />}
      />


      <Autocomplete
        multiple
        disableCloseOnSelect
        options={VERBE_MENU}
        value={selectedVerbes}
        onChange={(event, value) => setSelectedVerbes(expandAliases(value))}
        groupBy={option => option.group == undefined ? locale({fr: "verbes individuels", en: "individual verbs"}) : null}
        getOptionLabel={verb => verb.infinitif ?? verb.group}
        renderInput={(params) => <TextField {...params} label={locale({fr: "Verbes", en: "Verbs"})} />}
        renderOption={(props, option) => {
          const {key, ...optionProps} = props
          return <Box key={key} {...optionProps}>
            <div style={{display: "block", width: "100%"}}>
              <span>{option.infinitif ?? option.group}</span>
              <span style={{float: "right"}}>
                {option.hasAudio ? <VolumeUpIcon fontSize="small" color="disabled"/> : null}
              </span>
            </div>
          </Box>
        }}
      />

      <Autocomplete
        multiple
        disableCloseOnSelect
        options={[
          {label: locale({fr: "(sélectionner toutes)", en: "(select all)"}), expand: new Set(TEMPS)},
          ...TEMPS,
        ]}
        value={selectedTemps}
        onChange={(event, v) => setSelectedTemps(expandAliases(v))}
        groupBy={option => option.mode}
        getOptionLabel={option => formatTemps(option.mode, option.temps).replaceAll('_', ' ')}
        renderInput={(params) => <TextField {...params} label={locale({fr: "Modes et temps", en: "Moods and tenses"})} />}
        renderOption={(props, option) => {
          const {key, ...optionProps} = props
          return <Box key={key} {...optionProps}>{option.temps?.replaceAll('_', ' ') || option.label}</Box>
        }}
      />

      <Button
        variant="contained"
        onClick={() => randomButton()}
      >
        {locale({fr: "Phrase aléatoire", en: "Random phrase"})}
      </Button>

      <Grid container spacing={2}>
        <Grid size={4}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => prononcer()}
          >
            {locale({fr: "Prononcer", en: "Speak"})}
          </Button>
          <Switch
            checked={prononcerSwitch}
            onChange={(event, value) => setPrononcerSwitch(value)}
          />
        </Grid>

        <Grid size={4}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setShowParts(true)}
          >
            {locale({fr: "Décomposer", en: "Show parts"})}
          </Button>
          <Switch
            checked={partsSwitch}
            onChange={(event, value) => {
              setPartsSwitch(value)
              setShowParts(value)
            }}
          />
        </Grid>

        <Grid size={4}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              revealAnswer(true)
            }}
          >
            {locale({fr: "Conjuger", en: "Show conjugated"})}
          </Button>
          <Switch
            checked={conjugéSwitch}
            onChange={(event, value) => {
              setConjugéSwitch(value)
              setShowConjugé(value)
              revealAnswer(value)
            }}
          />
        </Grid>
      </Grid>

      <h3 style={{visibility: showParts ? 'visible' : 'hidden'}}>
      {currentConjugation.personne.pronom} + {currentConjugation.verbe} ({formatTemps(currentConjugation.mode, currentConjugation.temps)})
      </h3>

      <div id="conjugé">
        {showHint ? <ConjugéOverlay/> : null}
        <input
          required
          id="conjugé-input"
          value={conjugéInput}
          onChange={(event) => setConjugéInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              const correct = answerIsCorrect()
              setShowHint(true)
              if (correct) {
                if (showHint) { // hint already shown
                  setShowHint(false)
                  randomButton()
                } else if (!prononcerSwitch) {
                  prononcer()
                }
              }
            } else if (event.key == ",") {
              setShowParts(!showParts)
              event.preventDefault()
            } else if (event.key == "." || event.key == ";") {
              revealAnswer(!showConjugé)
              event.preventDefault()
            } else if (event.key == "/" || event.key == ":") {
              prononcer()
              event.preventDefault()
            } else {
              setShowHint(false)
            }
          }}
        ></input>
      </div>

    </Stack>
  </ThemeProvider>
}

export default App

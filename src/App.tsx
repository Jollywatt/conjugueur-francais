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
import { ThemeProvider, createTheme, useColorScheme } from '@mui/material/styles';

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
  const [UIFont, setUIFont] = useState(false)
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
  const [conjugéOverlay, setConjugéOverlay] = useState<string>('x')

  function getSelectedVerbes() {
    let all = new Set()
    for (const entry of selectedVerbes) {
      if (entry.infinitif !== undefined) {
        all.add(entry.infinitif)
      } else if (entry.verbes !== undefined) {
        all = all.union(entry.verbes)
      }
    }
    return all.size > 0 ? Array.from(all) : VERBES
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

    if (prononcerSwitch) prononcer(conj)
  }


  useEffect(() => randomButton(), [])

  useHotkeys('return', randomButton)
  useHotkeys('space', () => prononcer())
  useHotkeys('comma,p', () => setShowParts(!showParts))
  useHotkeys('.,c', () => revealAnswer(!showConjugé))
  // useHotkeys('.,c', () => setShowConjugé(!showConjugé))


  function revealAnswer(shown) {
    setShowConjugé(shown)
    setConjugéInput(shown ? currentConjugation.conjugé : '')
  }

  const answerIsCorrect = () => conjugéInput == currentConjugation.conjugé

  const theme = createTheme({
    colorSchemes: {
      dark: useMediaQuery('(prefers-color-scheme: dark)'),
    },
  })
  const helpButtonRef = useRef()
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const HelpWindow = props => <>
    <Popover
      open={props.show}
      anchorEl={props.helpButtonRef.current}
      onClose={props.onClose}
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
            fr: <p>
              Les commutateurs à bascule contrôlent ce qui est affiché lorsqu'une nouvelle phrase est choisie.
              Par exemple, en activant uniquement « parties », vous pouvez pratiquer la conjugaison des verbes,
              et en activant uniquement « discours », vous pouvez apprendre à quoi ressemblent les différents temps.              </p>,
            en: <p>
              The toggle switches control what is shown when a new phrase is chosen.
              For example, by selecting only the "show parts" switch, you can practice verb conjugations,
              and by selecting only the "speak" switch, you can learn how the different tenses sound.
            </p>,
          })}

          {locale({
            fr: <p>
              Les prononcés sont téléchargés sous forme de clips audio. Seuls les 50 premiers verbes ont de l’audio.
            </p>,
            en: <p>
              Pronounciations are downloaded as audio clips. Only the top 50 verbs have audio.
            </p>,
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
                <td><Key>.</Key> ou <Key>c</Key></td>
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
                <td><Key>.</Key> or <Key>c</Key></td>
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
  </>

  const wrong = (x) => <span className="error">{x}</span>

  function ConjugéOverlay(props) {
    const correct = currentConjugation.conjugé

    let elements = []
    let classes = []

    if (conjugéInput == correct) {
      elements.push(<span className="correct">{correct}</span>)
    } else {
      for (let i = 0; i < conjugéInput.length; i++) {
        if (conjugéInput[i] == correct[i]) {
          elements.push(correct[i])
        } else {
          elements.push(wrong(conjugéInput[i]))
        }
      }
      if (correct.length > conjugéInput.length) classes.push("incomplete")
    }

    return <div id="conjugé-overlay" className={classes}>{elements}</div>
  }

  return <ThemeProvider theme={theme}>
    <Stack spacing={3} id={"app-body"} className={UIFont ? "fancy" : null}>

      <h1>{locale({fr: "Conjugueur Français", en: "French conjugator"})}</h1>

      <div>
        <Button
          ref={helpButtonRef}
          onClick={e => setShowHelp(true)}>
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

      <HelpWindow
        helpButtonRef={helpButtonRef}
        show={showHelp}
        onClose={() => setShowHelp(false)}
        />


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

      <Autocomplete
        multiple
        disableCloseOnSelect
        options={VERBE_MENU}
        value={selectedVerbes}
        onChange={(event, v) => setSelectedVerbes(expandAliases(v))}
        groupBy={option => option.group == undefined ? locale({fr: "verbes individuels", en: "individual verbs"}) : null}
        getOptionLabel={verb => verb.infinitif ?? verb.group}
        renderInput={(params) => <TextField {...params} label={locale({fr: "Verbes", en: "Verbs"})} />}
        renderOption={(props, option) => {
          const {key, ...optionProps} = props
          return <Box key={key} {...optionProps}>
            <div style={{display: "block", width: "100%"}}>
              <span>{option.infinitif ?? option.group}</span>
              <span style={{float: "right"}}>
                {option.hasAudio ? <VolumeUpIcon color="disabled"/> : null}
              </span>
            </div>
          </Box>
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
              revealAnswer(false)
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
          onChange={(e, value) => setConjugéInput(e.target.value)}
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              if (answerIsCorrect() && showHint) {
                setShowHint(false)
                randomButton()
              } else {
                setShowHint(true)
              }
            } else if (event.key == "/") {
              prononcer()
              event.preventDefault()
            } else if (event.key == ",") {
              setShowParts(!showParts)
              event.preventDefault()
            } else if (event.key == ".") {
              revealAnswer(!showConjugé)
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

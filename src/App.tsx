import { useState, useEffect } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Switch,
  Select,
  MenuItem,
  Stack,
  TextField,
  Grid2 as Grid,
  createTheme,
  ThemeProvider,
  Popover,
  Typography,
  Paper,
} from '@mui/material'
import { useHotkeys } from 'react-hotkeys-hook'

import './App.css'

import {
  TEMPS,
  VERBES,
  VERBE_MENU,
  PERSONNES,
  chooseRandom,
  conjugate,
} from './conjugation.tsx'


import removeAccents from 'remove-accents'


function expandAliases(values) {
  let expandedValues = new Set()
  for (let value of values) {
    if (value.expand !== undefined) {
      expandedValues = expandedValues.union(value.expand)
    } else {
      expandedValues.add(value)
    }
  }
  return Array.from(expandedValues)
}

function Key({ children }) {
  return (
    <span className="key">{children}</span>
  )
}


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

  const [voice, setVoice] = useState(null)
  const availableVoices = speechSynthesis.getVoices()
    .map(v => {v.is_fr = v.lang == 'fr-FR'; return v})
    .sort((a, b) => a.is_fr != b.is_fr ? a.is_fr < b.is_fr : a.lang > b.lang )




  function getSelectedVerbes() {
    let all = new Set()
    for (let entry of selectedVerbes) {
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

  function speak(text: String, v) {
    let u = new SpeechSynthesisUtterance(text)
    u.voice = v ?? voice
    u.rate = 0.8
    speechSynthesis.speak(u)
  }

  function prononcer(conj) {
    if (conj === undefined) conj = currentConjugation
    // speak(currentConjugation.conjugé)
    let filename = removeAccents(`${import.meta.env.BASE_URL}/audio/${conj.verbe}/${conj.mode}/${conj.temps}/${conj.conjugé}.mp3`).replaceAll(' ', '_')
    console.log(filename)

    let audio = new Audio(filename)
    audio.play()
  }

  function randomButton() {
    let parts = chooseRandom(getSampleSpace())
    let conjugé = conjugate(parts)

    let conj = {
      mode: parts.temps.mode,
      temps: parts.temps.temps,
      verbe: parts.verbe,
      personne: parts.personne,
      conjugé,
    }
    setCurrentConjugation(conj)

    setShowParts(partsSwitch)
    setShowConjugé(conjugéSwitch)

    if (prononcerSwitch) prononcer(conj)
  }


  useEffect(() => randomButton(), [])

  useHotkeys('return', randomButton)
  useHotkeys('space', () => prononcer())
  useHotkeys('comma,p', () => setShowParts(!showParts))
  useHotkeys('.,c', () => setShowConjugé(!showConjugé))

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <h1>{locale({fr: "Conjugueur Français", en: "French conjugator"})}</h1>


      <Button onClick={handleClick}>
        {locale({fr: "Aide", en: "Help"})}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
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

            <Typography>🇫🇷<Switch
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
                For example, by selecting only the "parts" switch, you can practice verb conjugations,
                and by selecting only the "speech" switch, you can learn how the different tenses sound.
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


       {/*   <h4>Voix synthétique pour la prononciation:</h4>
          <Autocomplete
            label="Voix"
            value={voice}
            options={availableVoices}
            disableCloseOnSelect

            onChange={(event, v) => {
              setVoice(v)
              if (v != null) speak(v.name, v)
            }}
            getOptionLabel={v => !v ? "Default" : `${v.lang} “${v.name}” ${v.voiceURI}`}
            renderInput={(params) => <TextField {...params} label="Voix" />}
          />
          <p>Laisser vide pour la voix par défaut.</p>*/}

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
                  <td><Key>espace</Key></td>
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
                  <td><Key>space</Key></td>
                  <td>Speak conjugated phrase</td>
                </tr>
              </tbody>,
            })}
          </table>
        </Paper>
      </Popover>

      <div className="card">

        <Stack spacing={3}>

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
            getOptionLabel={option => `${option.temps} (${option.mode})`.replaceAll('_', ' ')}
            renderInput={(params) => <TextField {...params} label={locale({fr: "Modes et temps", en: "Moods and tenses"})} />}
            renderOption={(props, option) => {
              const {key, ...optionProps} = props
              return <Box key={props.key} {...optionProps}>{option.temps?.replaceAll('_', ' ') || option.label}</Box>
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
          />


          <Button
            variant="contained"
            onClick={() => randomButton()}
          >
            {locale({fr: "Phrase aléatoire", en: "Random phrase"})}
          </Button>

          <Grid container spacing={3}>
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
                onClick={() => setShowConjugé(true)}
              >
                {locale({fr: "Conjuger", en: "Show conjugated"})}
              </Button>
              <Switch
                checked={conjugéSwitch}
                onChange={(event, value) => {
                  setConjugéSwitch(value)
                  setShowConjugé(value)
                }}
              />
            </Grid>
          </Grid>

          <h3 style={{visibility: showParts ? 'visible' : 'hidden'}}>
          « {currentConjugation.personne.pronom} + {currentConjugation.verbe} »
          au {currentConjugation.temps} ({currentConjugation.mode})</h3>

          <h2 id="conjugé" style={{visibility: showConjugé ? 'visible' : 'hidden'}}>{currentConjugation.conjugé}</h2>

        </Stack>
      </div>
    </>
  )
}

export default App

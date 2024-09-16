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

function InstructionsPopup() {
  
}

function App() {

  const [currentConjugation, setCurrentConjugation] = useState({
    mode: "indicatif",
    temps: "présent",
    verbe: "savoir",
    personne: "nous",
    conjugé: "nous avons su",
  })


  const [selectedPersonnes, setSelectedPersonnes] = useState(PERSONNES)
  const [selectedTemps, setSelectedTemps] = useState(TEMPS.slice(0, 3))
  const [selectedVerbes, setSelectedVerbes] = useState(VERBE_MENU.slice(0, 1))

  const [prononcerSwitch, setPrononcerSwitch] = useState<boolean>(false)
  const [partsSwitch, setPartsSwitch] = useState<boolean>(false)
  const [conjugéSwitch, setConjugéSwitch] = useState<boolean>(false)

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

  function getSelectedPersonnes() {
    return selectedPersonnes.length > 0 ? selectedPersonnes : PERSONNES
  }

  function getSelectedTemps() {
    return selectedTemps.length > 0 ? selectedTemps : TEMPS
  }

  function getSampleSpace() {
    return {
      personnes: getSelectedPersonnes(),
      temps: getSelectedTemps(),
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
    let filename = removeAccents(`/${conj.verbe}/${conj.mode}/${conj.temps}/${conj.conjugé}.mp3`).replaceAll(' ', '_')
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
      <h1>Conjugueur Français</h1>

      <Button onClick={handleClick}>
        Instructions
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

          <h4>Voix synthétique pour la prononciation:</h4>
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
          <p>Laisser vide pour la voix par défaut.</p>

          <h4>Keyboard shortcuts</h4>

          <table>
            <tbody>
              <tr>
                <td><Key>return</Key></td>
                <td>Choisir une autre exemple</td>
                <td>Generate random example</td>
              </tr>
              <tr>
                <td><Key>,</Key> ou <Key>p</Key></td>
                <td>Voir les parts</td>
                <td>See components</td>
              </tr>
              <tr>
                <td><Key>.</Key> ou <Key>c</Key></td>
                <td>Voir la phrase conjugé</td>
                <td>See conjugated phrase</td>
              </tr>
              <tr>
                <td><Key>space</Key></td>
                <td>Prononcer la phrase conjugé</td>
                <td>Speak conjugated phrase</td>
              </tr>
            </tbody>
          </table>
        </Paper>
      </Popover>

      <div className="card">

        <Stack spacing={3}>

          <Autocomplete
            disableCloseOnSelect
            options={[
              {label: "(sélectionner toutes)", expand: new Set(PERSONNES)},
              ...PERSONNES,
            ]}
            value={selectedPersonnes}
            onChange={(event, value) => {
              let v = expandAliases(value)
              setSelectedPersonnes(v)
              console.log(v, value.indexOf({pronom: "all"}) )
            }}
            multiple
            // groupBy={option => `${option.personne}° ${option.plureil ? "plureil" : "singulier"}`}
            getOptionLabel={option => option.pronom || option.label}
            renderInput={(params) => <TextField {...params} label="Personnes" />}
          />

          <Autocomplete
            multiple
            disableCloseOnSelect
            options={[
              {label: "(sélectionner toutes)", expand: new Set(TEMPS)},
              ...TEMPS,
            ]}
            value={selectedTemps}
            onChange={(event, v) => setSelectedTemps(expandAliases(v))}
            groupBy={option => option.mode}
            getOptionLabel={option => `${option.temps} (${option.mode})`.replaceAll('_', ' ')}
            renderInput={(params) => <TextField {...params} label="Modes et temps" />}
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
            onChange={(event, v) => setSelectedVerbes(v)}
            groupBy={option => option.group == undefined ? "individual verbs" : null}
            getOptionLabel={verb => verb.infinitif ?? verb.group}
            renderInput={(params) => <TextField {...params} label="Verbes" />}
          />


          <Button
            variant="contained"
            onClick={() => randomButton()}
          >
            Choisir au hasard
          </Button>

          <Grid container spacing={3}>
            <Grid size={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => prononcer()}
              >
                Prononcer
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
                Décomposer
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
                Conjuger
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

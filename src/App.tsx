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

  const [settings, setSettings] = useState({
    prononcer: false,
    parts: true,
    conjugé: true,
  })

  const [voice, setVoice] = useState(null)
  const availableVoices = speechSynthesis.getVoices()
    .map(v => {v.is_fr = v.lang == 'fr-FR'; return v})
    .sort((a, b) => a.is_fr != b.is_fr ? a.is_fr < b.is_fr : a.lang > b.lang )

  const [revealed, setRevealed] = useState({
    parts: false,
    conjugé: false
  })


  const [personnes, setPersonnes] = useState(PERSONNES)
  const [temps, setTemps] = useState(TEMPS.slice(0, 3))
  const [verbes, setVerbs] = useState(VERBE_MENU.slice(0, 1))


  function getSelectedVerbes() {
    let all = new Set()
    for (let entry of verbes) {
      if (entry.infinitif !== undefined) {
        all.add(entry.infinitif)
      } else if (entry.verbes !== undefined) {
        all = all.union(entry.verbes)
      }
    }
    return all.size > 0 ? Array.from(all) : VERBES
  }

  function getSelectedPersonnes() {
    return personnes.length > 0 ? personnes : PERSONNES
  }

  function getSelectedTemps() {
    return temps.length > 0 ? temps : TEMPS
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


  function prononcer() {
    speak(currentConjugation.conjugé)
  }

  function randomButton() {
    let parts = chooseRandom(getSampleSpace())
    let conjugé = conjugate(parts)

    setCurrentConjugation({
      mode: parts.temps.mode,
      temps: parts.temps.temps,
      verbe: parts.verbe,
      personne: parts.personne,
      conjugé,
    })

    setRevealed({
      parts: settings.parts,
      conjugé: settings.conjugé,
    })

    if (settings.prononcer) speak(conjugé)
  }

  function partsButton() {
    setRevealed({...revealed, parts: true})
  }
  function conjugéButton() {
    setRevealed({...revealed, conjugé: true})
  }

  useEffect(() => randomButton(), [])

  useHotkeys('return', randomButton)
  useHotkeys('space', prononcer)
  useHotkeys('comma,p', () => {
    setRevealed({...revealed, parts: !revealed.parts})
  })
  useHotkeys('.,c', () => {
    setRevealed({...revealed, conjugé: !revealed.conjugé})
  })

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
            options={PERSONNES}
            value={personnes}
            onChange={(event, v) => setPersonnes(v)}
            multiple
            // groupBy={option => `${option.personne}° ${option.plureil ? "plureil" : "singulier"}`}
            getOptionLabel={option => option.pronom}
            renderInput={(params) => <TextField {...params} label="Personnes" />}
            renderOption={(props, option) => {
              const {key, ...optionProps} = props
              return <Box key={props.key} {...optionProps}>{option.pronom}</Box>
            }}
          />

          <Autocomplete
            multiple
            disableCloseOnSelect
            options={TEMPS}
            value={temps}
            onChange={(event, v) => setTemps(v)}
            groupBy={option => option.mode}
            getOptionLabel={option => `${option.temps} (${option.mode})`.replaceAll('_', ' ')}
            renderInput={(params) => <TextField {...params} label="Modes et temps" />}
            renderOption={(props, option) => {
              const {key, ...optionProps} = props
              return <Box key={props.key} {...optionProps}>{option.temps.replaceAll('_', ' ')}</Box>
            }}
          />

          <Autocomplete
            multiple
            disableCloseOnSelect
            options={VERBE_MENU}
            value={verbes}
            onChange={(event, v) => setVerbs(v)}
            groupBy={option => option.group == undefined ? "individual verbs" : "groups"}
            getOptionLabel={verb => verb.infinitif ?? verb.group}
            renderInput={(params) => <TextField {...params} label="Verbes" />}
          />


          <Button
            variant="contained"
            onClick={() => randomButton()}
          >
            Au hasard
          </Button>

          <Grid container spacing={3}>
            <Grid size={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={prononcer}
              >
                Prononcer
              </Button>
              <Switch
                checked={settings.prononcer}
                onChange={(event, value) => setSettings({...settings, prononcer: value})}
              />
            </Grid>

            <Grid size={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={partsButton}
              >
                Décomposer
              </Button>
              <Switch
                checked={settings.parts}
                onChange={(event, value) => {
                  setSettings({...settings, parts: value})
                  setRevealed({...revealed, parts: value})
                }}
              />
            </Grid>

            <Grid size={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={conjugéButton}
              >
                Conjuger
              </Button>
              <Switch
                checked={settings.conjugé}
                onChange={(event, value) => {
                  setSettings({...settings, conjugé: value})
                  setRevealed({...revealed, conjugé: value})
                }}
              />
            </Grid>
          </Grid>

          <h3 style={{visibility: revealed.parts ? 'visible' : 'hidden'}}>
          « {currentConjugation.personne.pronom} + {currentConjugation.verbe} »
          au {currentConjugation.temps} ({currentConjugation.mode})</h3>

          <h2 id="conjugé" style={{visibility: revealed.conjugé ? 'visible' : 'hidden'}}>{currentConjugation.conjugé}</h2>

        </Stack>
      </div>
    </>
  )
}

export default App

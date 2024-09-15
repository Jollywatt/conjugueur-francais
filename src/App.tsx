import { useState, useEffect, Component } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { useHotkeys } from 'react-hotkeys-hook'

import './App.css'
import {
  speak,
  TEMPS,
  VERBES,
  VERBE_MENU,
  CONJUGASIONS,
  VERBES_GROUPE_3,
  VERBES_GROUPE_2,
  VERBES_GROUPE_1,
  PERSONNES,
  chooseRandom,
  conjugate,
} from './conjugation.tsx'

import {
  Autocomplete,
  Box,
  Button,
  Switch,
  Stack,
  TextField,
  Grid2 as Grid,
  createTheme,
  ThemeProvider,
  Popover,
  Typography,
} from '@mui/material'
import { red, blue } from '@mui/material/colors';


function Key({ children }) {
  return (
    <span class="key">{children}</span>
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
        <Typography sx={{ p: 2 }}>
          <h3>Keyboard shortcuts</h3>
          <table>
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
          </table>
        </Typography>
      </Popover>

      <div className="card">

        <Stack spacing={3}>

          <Autocomplete
            multiple
            disableCloseOnSelect
            options={PERSONNES}
            value={personnes}
            onChange={(event, v) => setPersonnes(v)}
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
            CHOISIR
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
                Voir parts
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
                Voir conjugé
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

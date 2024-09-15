import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
  // Alert,
  Autocomplete,
  Box,
  Button,
  Switch,
  // FormLabel,
  // Grow,
  Stack,
  Typography,
  TextField,
  Grid2 as Grid,
} from '@mui/material'


function App() {
  window.CONJUGASIONS = CONJUGASIONS

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



  const [personnes, setPersonnes] = useState([])
  const [temps, setTemps] = useState([])
  const [verbes, setVerbs] = useState([])

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


  return (
    <>
      <h1>Jeu de Conjugasions</h1>
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
            onClick={() => {
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
            }}
          >
            Choose random
          </Button>

          <Grid
            container
            spacing={3}
            // sx={{ flexGrow: 1 }}
          >
            <Grid size={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                prononcer()
                // setSettings({...settings, prononcer: true})
              }}
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
              onClick={() => setRevealed({...revealed, parts: true})}
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
              onClick={() => setRevealed({...revealed, conjugé: true})}
            >
              Voir Conjugé

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
          <h2 style={{visibility: revealed.conjugé ? 'visible' : 'hidden'}}>{currentConjugation.conjugé}</h2>

        </Stack>
      </div>
    </>
  )
}

export default App

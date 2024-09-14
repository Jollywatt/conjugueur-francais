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
  const [currentConjugation, setCurrentConjugation] = useState({
    mode: "indicatif",
    temps: "présent",
    verbe: "savoir",
    personne: "nous",
    conjugé: "nous avons su",
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

    return Array.from(all)
  }

  function getSelectedPersonnes() {
    let indices = new Set()
    for (let p of personnes) {
      indices.add(p.personne + 3*p.plureil - 1)
    }
    return Array.from(indices).sort()
  }

  function getSampleSpace() {
    return {
      personnes: getSelectedPersonnes(),
      temps: temps,
      verbes: getSelectedVerbes(),
    }
  }




  return (
    <>
      <h1>Conjugation Quizzer</h1>
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
            onClick={() => console.log(getSampleSpace())}
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
                let [p, t, v] = [personnes, temps, verbes]
                // speak(`${p}, ${t}, ${v}`)
                console.log([p, t, v])
              }}
            >
              Prononcer

              <Switch/>
            </Button>
            </Grid>


            <Grid size={4}>
            <Button
              fullWidth
              variant="outlined"
            >
              Voir parts

              <Switch/>
            </Button>
            </Grid>

            <Grid size={4}>
            <Button
              fullWidth
              variant="outlined"
            >
              Voir Conjugé

              <Switch/>
            </Button>
            </Grid>



          </Grid>

          <h3>que + ils + avoir (subjonctif présent)</h3>
          <h2>qu'ils aient</h2>

        </Stack>

        <p>State</p>
        <pre>
        personnes: {JSON.stringify(personnes)}
        </pre>
        <pre>
        temps: {JSON.stringify(temps)}
        </pre>
        <pre>
        verbes: {JSON.stringify(verbes)}
        </pre>
      </div>
    </>
  )
}

export default App

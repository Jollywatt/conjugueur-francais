import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
  speak
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

  const allTemps = [
    {mode: "indicatif", temps: "présent"},
    {mode: "indicatif", temps: "passé composé"},
    {mode: "indicatif", temps: "imparfait"},
    {mode: "indicatif", temps: "plus-que-parfait"},
    {mode: "indicatif", temps: "passé simple"},
    {mode: "indicatif", temps: "passé antérieur"},
    {mode: "indicatif", temps: "futur"},
    {mode: "indicatif", temps: "futur antérieur"},
    {mode: "indicatif", temps: "futur proche"},
    {mode: "conditionnel", temps: "présent"},
    {mode: "conditionnel", temps: "passé"},
    {mode: "conditionnel", temps: "passé - forme alternative"},
    {mode: "subjonctif", temps: "présent"},
    {mode: "subjonctif", temps: "imparfait"},
    {mode: "subjonctif", temps: "plus-que-parfait"},
    {mode: "subjonctif", temps: "passé"},
    {mode: "impératif", temps: "présent"},
    {mode: "participe", temps: "présent"},
    {mode: "participe", temps: "passé"},
  ]

  const allVerbs = [
    {group: "Top 100"},
    {group: "1er groupe (-er)"},
    {group: "2e groupe (-ir)"},
    {group: "3e groupe (-ir, -re)"},
    {infinitif: "être"},
    {infinitif: "avoir"},
    {infinitif: "faire"},
    {infinitif: "dire"},
    {infinitif: "pouvoir"},
    {infinitif: "aller"},
    {infinitif: "voir"},
    {infinitif: "savoir"},
    {infinitif: "vouloir"},
    {infinitif: "venir"},
  ]

  const allPersonnes = [
    {personne: 1, plureil: false, pronom: "je"},
    {personne: 2, plureil: false, pronom: "tu"},
    {personne: 3, plureil: false, pronom: "il"},
    {personne: 3, plureil: false, pronom: "elle"},
    {personne: 3, plureil: false, pronom: "on"},
    {personne: 1, plureil: true, pronom: "nous"},
    {personne: 2, plureil: true, pronom: "vous"},
    {personne: 3, plureil: true, pronom: "ils"},
    {personne: 3, plureil: true, pronom: "elles"},
  ]

  return (
    <>
      <h1>Conjugation Quizzer</h1>
      <div className="card">

        <Stack spacing={3}>
          <Autocomplete
            multiple
            disableCloseOnSelect
            options={allPersonnes}
            value={personnes}
            onChange={(event, v) => setPersonnes(v)}
            // groupBy={option => `${option.personne}° ${option.plureil ? "plureil" : "singulier"}`}
            getOptionLabel={option => option.pronom}
            renderInput={(params) => <TextField {...params} label="Personnes" />}
          />

          <Autocomplete
            multiple
            disableCloseOnSelect
            options={allTemps}
            value={temps}
            onChange={(event, v) => setTemps(v)}
            groupBy={option => option.mode}
            getOptionLabel={option => `${option.temps} (${option.mode})`}
            renderInput={(params) => <TextField {...params} label="Modes et temps" />}
            renderOption={(props, option) => {
              const {key, ...optionProps} = props
              return <Box key={props.key} {...optionProps}>{option.temps}</Box>
            }}
          />

          <Autocomplete
            multiple
            disableCloseOnSelect
            options={allVerbs}
            value={verbes}
            onChange={(event, v) => setVerbs(v)}
            groupBy={option => option.group == undefined ? "individual verbs" : "groups"}
            getOptionLabel={verb => verb.infinitif ?? verb.group}
            renderInput={(params) => <TextField {...params} label="Verbes" />}
          />


          <Button
            variant="contained"
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
      </div>
    </>
  )
}

export default App

import logo from './logo.svg';
import './App.css';
import React,{useState,useEffect} from "react";
import axios from "axios"
import {format} from "date-fns"


function App() {
  const [seriesList, setSeriesList] = useState([]);   
  const [cad,setCad] = useState("");  
  const [search,setSearch] = useState("");  
  const [saved,setSaved] = useState("");  

  const clickcad = async (e)=>{
      e.preventDefault();
      setCad(true)
      setSearch(false)
      setSaved(false)
  }

  const saveSerie = async (e)=>{
     e.preventDefault();
     const year = e.target.Year.value
     const name = e.target.seriesName.value
     const season = e.target.Season.value
     const prov = e.target.Provider.value
     const app = e.target.App.value
     const status = e.target.Status.value
     
     const serie = {
             "Year" : parseInt(year),
             "SeriesName" : name,
             "Season": season,
             "Provider" : prov,
             "App" : app,
             "Status" : status
      }
     const data = await axios.post('https://victor-mongodbapi.herokuapp.com/Series/insert',serie)
     setCad(false)
     setSearch(false)
     setSaved(true)
  }

  const fetchbyName = async (e)=>{
    if (e.which == 13) {
      e.preventDefault();
      setCad(false)
      setSearch(true)
      setSaved(false)
      var name = e.target.value;
      console.log(name)
      const data = await axios.get('https://victor-mongodbapi.herokuapp.com/Series/find?name='+name+'&app=&status=')
      const {series} = data.data
      setSeriesList(series);
      console.log(data)
    }
}

const fetchbyApp = async (e)=>{
  if (e.which == 13) {
    e.preventDefault();
    setCad(false)
    setSearch(true)
    setSaved(false)
    var app = e.target.value;
    console.log(app)
    const data = await axios.get('https://victor-mongodbapi.herokuapp.com/Series/find?name=&app='+app+'&status=')
    const {series} = data.data
    setSeriesList(series);
    console.log(data)
  }
}
  
  const fetchbyStatus = async (e)=>{
       e.preventDefault();
       setCad(false)
       setSearch(true)
       setSaved(false)
       var status = e.target.value;
       console.log(status)
       const data = await axios.get('https://victor-mongodbapi.herokuapp.com/Series/find?name=&app=&status='+status)
       const {series} = data.data
       setSeriesList(series);
       console.log(data)

  }

  const renderCad = () => {
    if (cad) {
      return <form onSubmit={saveSerie} ><table align='center'>
        <tr>
          <td colSpan={2} className="title2">
            <font size='6'>
          Inserir nova série</font>
          </td>
        </tr>    
         <tr>
          <td>Year</td>
          <td><input type="text" name="Year"></input></td>
        </tr> 
        <tr>
          <td>Series Name</td>
          <td><input type="text" name="seriesName"></input></td>
        </tr>
        <tr>
          <td>Season</td>
          <td><input type="text" name="Season"></input></td>
        </tr>
        <tr>
          <td>Provider</td>
          <td><input type="text" name="Provider"></input></td>
        </tr>
        <tr>
          <td>App</td>
          <td><input type="text" name="App"></input></td>
        </tr>
        <tr>
          <td>Status</td>
          <td><select name='Status' >
            <option value='Watched'>Watched</option>
            <option value='Watching'>Watching</option>
            <option value='Waiting'>Waiting</option>
        </select></td>
        </tr>
        <tr>
          <td colSpan={2}>
          <button type='submit' width='100' >Salvar</button>
          </td>
        </tr>        
      </table></form>;  
    }
  }

  const renderSeries =() => {
    if( search ){
     return <table align='center'>
        <tr>
            <td>Ano</td>
            <td>Serie</td>
            <td>Temporada</td>
            <td>App</td>
            <td>Status</td>
        </tr>
          {seriesList.map(serie => {
              return (
                <tr>
                  <td>{serie.Year}</td>
                  <td>{serie.SeriesName}</td>
                  <td>{serie.Season}</td>
                  <td>{serie.App}</td>
                  <td>{serie.Status} 
                 <input type="hidden" id="idStatus" value="{serie.id}"></input></td>
                </tr>
              )
          })}
        </table>;    
    }
  } 

  const renderSaved =() => {
    if( saved ){
     return <table align='center'>
        <tr>
            <td>Nova Série Salva</td>
        </tr>
        </table>;    
    }
  } 
  /*const fetchNames = async () => {
    const data = await axios.get('/names')
    const {names} = data.data
    setNameList(names);
    console.log(data)
  }*/

  /*useEffect(() => {
    fetchNames();     
  }, []);
*/
  return (
    <div className="App-header">
        <table width={500} align='center'>  
            <tr align='center'>
              <td className='title'><font size='8'>
                 Dados de Séries</font>
              </td>
            </tr>
            <tr align='center'>
              <td>
              <img src={logo} className="App-logo" alt="logo" />
              </td>
            </tr>             
        </table>
        <table width={500} align='center'>     
            <tr>
               <td>
                 <input type="text" name="BuscaNome" id="BuscaNome" onKeyPress={fetchbyName} placeholder="Busca por Nome">
                       </input>
               </td>
               <td>
                <input type="text" name="BuscaApp" id="BuscaApp" onKeyPress={fetchbyApp} placeholder="Busca por App"></input>
              </td>
               <td width={120}>Busca por Status</td>
               <td>  <select id='BuscaStatus' name='BuscaStatus' onChange={fetchbyStatus}>
                              <option value=''></option>
                                  <option value='Watched'>Watched</option>
                                  <option value='Watching'>Watching</option>
                                  <option value='Waiting'>Waiting</option>
                  </select>              
               </td>
               <td>
               <button name='Cadastro' onClick={clickcad} width='20'>Inserir </button>
               </td>
            </tr>
        </table> 
        <table align='center'>
          <tr>
            <td>
              <hr></hr>
            </td>
          </tr>
        </table>
        {renderCad()}         
        {renderSeries()}  
        {renderSaved()}    
    </div>
  );
}

export default App;

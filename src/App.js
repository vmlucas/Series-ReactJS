import logo from './logo.svg';
import './App.css';
import React,{useState,useEffect, Fragment} from "react";
import axios from "axios"
import {format} from "date-fns"


function App() {
  const [seriesList, setSeriesList] = useState([]);   
  const [cad,setCad] = useState("");  
  const [search,setSearch] = useState("");  
  const [saved,setSaved] = useState("");  

  //variables for edit
  const [year,setYear] = useState("");  
  const [name,setName] = useState("");  
  const [season,setSeason] = useState("");   
  const [prov,setProv] = useState("");  
  const [app,setAPP] = useState("");   
  const [status,setStatus] = useState(""); 
  const [text,setText] = useState(""); 
  
  const clickcad = async (e)=>{
      e.preventDefault();
      setCad(true)
      setSearch(false)
      setSaved(false)
  }

  const saveSerie = async (e)=>{
     e.preventDefault();
     const yearSave = e.target.Year.value
     const nameSave = e.target.seriesName.value
     const seasonSave = e.target.Season.value
     const provSave = e.target.Provider.value
     const appSave = e.target.App.value
     const statusSave = e.target.Status.value
     
     const serie = {
             "Year" : parseInt(yearSave),
             "SeriesName" : nameSave,
             "Season": seasonSave,
             "Provider" : provSave,
             "App" : appSave,
             "Status" : statusSave
      }
     const data = await axios.post('https://home-mongodbapi.azurewebsites.net/Series/insert',serie)
     setCad(false)
     setSearch(false)
     setSaved(true)
  }
  
  const updateSerie = async ({d}) => {
    //e.preventDefault();
    const serie = {
            "id" : d.id, 
            "Year" : year===''?d.Year:parseInt(year),
            "SeriesName" : name===''?d.SeriesName:name,
            "Season": season===''?d.Season:season,
            "Provider" : prov===''?d.Provider:prov,
            "App" : app===''?d.App:app,
            "Status" : status===''?d.Status:status,
     }
    console.log(serie) 
    const data = await axios.post('https://home-mongodbapi.azurewebsites.net/Series/update',serie)
    setText(data.data)
    setCad(false)
    setSearch(false)
    setSaved(true)
  }  

  const fetchbyName = async (e)=>{
    if (e.which === 13) {
      e.preventDefault();
      setCad(false)
      setSearch(true)
      setSaved(false)
      var name = e.target.value;
      console.log(name)
      const data = await axios.get('https://home-mongodbapi.azurewebsites.net/Series/find?name='+name+'&app=&status=')
      const {series} = data.data
      setSeriesList(series);
      console.log(data)
    }
}

const fetchbyApp = async (e)=>{
  if (e.which === 13) {
    e.preventDefault();
    setCad(false)
    setSearch(true)
    setSaved(false)
    var app = e.target.value;
    console.log(app)
    const data = await axios.get('https://home-mongodbapi.azurewebsites.net/Series/find?name=&app='+app+'&status=')
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
       const data = await axios.get('https://home-mongodbapi.azurewebsites.net/Series/find?name=&app=&status='+status)
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
            <option value='Abandoned'>Abandoned</option>
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
            <td>Provider</td>
            <td>Status</td>
            <td></td>
        </tr>
          {seriesList.map(serie => {
              return ( <tr>
                  <td><input type="text" name="Year" placeholder={serie.Year} onChange={(event) => setYear(event.target.value)}></input></td>
                  <td><input type="text" name="seriesName" placeholder={serie.SeriesName} onChange={(event) => setName(event.target.value)}></input></td>
                  <td><input type="text" name="Season" placeholder={serie.Season} onChange={(event) => setSeason(event.target.value)}></input></td>
                  <td><input type="text" name="App" placeholder={serie.App} onChange={(event) => setAPP(event.target.value)}></input></td>
                  <td><input type="text" name="Provider" placeholder={serie.Provider} onChange={(event) => setProv(event.target.value)}></input></td>
                  <td><select name='Status' onChange={(event) => setStatus(event.target.value)}>
                        {renderOptions({s:serie.Status})}
                       </select></td>
                  <td>
                  <button name='update' 
                     onClick={() => updateSerie({d: serie})}
                     width='20'>Atualizar </button>
                  </td>                  
                </tr>
                //</form>
              )
          })}
        </table>;    
    }
  } 

  const renderEdited =() => {
    if( saved ){
     return <table align='center'>
        <tr>
            <td>{text}</td>
        </tr>
        </table>;    
    }
  } 

  const renderOptions =({s}) => {
    if( s === 'Watched')
    return <Fragment>
        <option value='Watched' selected>Watched</option>
        <option value='Watching'>Watching</option>
        <option value='Waiting'>Waiting</option>
        <option value='Abandoned'>Abandoned</option>
    </Fragment>;
    else if( s === 'Watching')
    return <Fragment>
        <option value='Watched' >Watched</option>
        <option value='Watching' selected>Watching</option>
        <option value='Waiting'>Waiting</option>
        <option value='Abandoned'>Abandoned</option>
    </Fragment>;
    else if( s === 'Waiting')
    return <Fragment>
        <option value='Watched' >Watched</option>
        <option value='Watching' >Watching</option>
        <option value='Waiting' selected>Waiting</option>
        <option value='Abandoned'>Abandoned</option>
    </Fragment>;
    else 
    return <Fragment>
        <option value='Watched' >Watched</option>
        <option value='Watching' >Watching</option>
        <option value='Waiting' >Waiting</option>
        <option value='Abandoned' selected>Abandoned</option>
    </Fragment>;
  } 

  const openInNewTab = url => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
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
        <table align='center' >  
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
        <table align='center'>     
            <tr>
               <td>
                 <input type="text" name="BuscaNome" id="BuscaNome" onKeyPress={fetchbyName} placeholder="Busca por Nome">
                       </input>
               </td>
               <td>
                <input type="text" name="BuscaApp" id="BuscaApp" onKeyPress={fetchbyApp} placeholder="Busca por App"></input>
              </td>
               <td >Busca por Status</td>
               <td>  <select id='BuscaStatus' name='BuscaStatus' onChange={fetchbyStatus}>
                              <option value=''></option>
                                  <option value='Watched'>Watched</option>
                                  <option value='Watching'>Watching</option>
                                  <option value='Waiting'>Waiting</option>
                                  <option value='Abandoned'>Abandoned</option>
                  </select>              
               </td>
               <td>
               <button name='Cadastro' onClick={clickcad} width='20'>Inserir </button>
               </td>
               <td>
               <button onClick={() => openInNewTab('https://charts.mongodb.com/charts-project-0-ohubx/public/dashboards/827a5078-c6d3-4f90-ac13-3cf1a875d2ab')}>
                 Dashboard
               </button>
               </td>
            </tr>
        </table> 
        <table align='center' >
          <tr >
            <td>
              <hr></hr>
            </td>
          </tr>
        </table>
        {renderCad()}         
        {renderSeries()}  
        {renderEdited()}    
    </div>
  );
}

export default App;

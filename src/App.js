import { Card, Spinner } from 'react-bootstrap';
import { useState, useEffect, Fragment } from 'react';
import axios from 'axios';

/*
Datos de conexión al API
Private Key: 5cfc8eee0a4f0cc7034185ec03360d98001ae013
Public Key: eee8dbdf35beadab8d05c92849436775

Entrada del hash: ts+privatekey+publickey /ts =1
                  15cfc8eee0a4f0cc7034185ec03360d98001ae013eee8dbdf35beadab8d05c92849436775

Hash en MD5: 1850c453e78910ae279ac45f5549a0c4

*/

function App() {

  const [listaPersonajes, setListaPersonajes] = useState([]);
  const [page, setPage ] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [inputValue, setInputValue] = useState(1);
  const [showLoading, setShowLoading] = useState(true);
  const elements = 8;

  useEffect(function () {
    setShowLoading(true);
    const url = "https://gateway.marvel.com:443/v1/public/characters?" + 
                "ts=1&" + 
                "apikey=eee8dbdf35beadab8d05c92849436775&" + 
                "hash=1850c453e78910ae279ac45f5549a0c4&"+
                "limit=" + elements + "&" +
                "offset=" + ((page-1) * elements);
    axios.get(url)
         .then(function(res) {
           setListaPersonajes(res.data.data.results);
           setTotalElements(res.data.data.total);
           setShowLoading(false);
         })
         .catch(function (error) {
           console.log(error);
         });
    
  },[page, elements]);

  const componentesPersonajes = listaPersonajes.map((p) => (
    <div className="col-sm-3" key={p.id}>
      <Card className="mt-2 mb-2" style={{height: '40rem'}}>
        <Card.Img variant="top" style={{ height: '20rem'}}
                  src={`${p.thumbnail.path}.${p.thumbnail.extension}`} >
        </Card.Img>
        <Card.Body>
          <Card.Title>{p.name}</Card.Title>
          <Card.Text style={{ fontSize: "10px" }}>
            { Boolean(p.description) ? p.description : 'No registra' }
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  ));

  const Paginator = function () {
    

    const onPrevio = function() {
      if (page>= 2) {
        setPage(parseInt(page)-1);
        setInputValue(parseInt(page)-1);
      }
    };
    const onSiguiente = function() {
      if (page < (Math.ceil(totalElements/elements))) {
        setPage(parseInt(page)+1);
        setInputValue(parseInt(page)+1);
      }
    };

    //Se modifica el estado interno del componente paginator 
    //para controlar el valor del input
    const onInputChange = function(evt) {
      setInputValue(evt.target.value);
    };

    //Se agrega para actualizar el estado page despues de terminar de digitar el número
    //en el onchange se destaba el effect con cada número digitado.
    const onInputBlur = function (evt) {
      if (parseInt(evt.target.value) >= 1 && 
          parseInt(evt.target.value) <= (Math.ceil(totalElements/elements))) {

          setPage(parseInt(evt.target.value));
        }
    }

    return (
      <Fragment>
      
      <nav className="mt-2">
        <ul className="pagination">
          <li className="page-item">
            <button className="page-link text-white btn-primary" onClick={onPrevio}>Previo</button>
          </li>
          <li className="page-item">
            <input className="form-control text-center" value={inputValue} 
            style={{ width: "100px" }} onChange={onInputChange} onBlur={onInputBlur} /> 
          </li>
          <li className="page-item" onClick={onSiguiente}>
            <button className="page-link text-white btn-primary">Siguiente</button>
          </li>
        </ul>
      </nav>
      <label>Paginas Totales { (Math.ceil(totalElements/elements)) }</label>
      </Fragment>  
    );
  }

  return (
    <div className="container">
      <Card className="bg-primary text-white mt-5">
        <Card.Body>
          <Card.Title>
            <h1>Personajes de Marvel</h1>
          </Card.Title>
          <Card.Text>
            Frontend para explorar los personajes de Marvel
          </Card.Text>
        </Card.Body>
      </Card>
      <Paginator className="mt-2" />
      <Card className="mt-2">
        <Card.Body>
          <div className="row">
            { showLoading? <Spinner animation="border" variant="primary" /> : componentesPersonajes }
          </div>
        </Card.Body>
      </Card>
      <Paginator className="mt-2" />
    </div>
  );
}

export default App;

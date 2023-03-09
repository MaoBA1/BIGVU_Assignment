import './App.css';
import { useEffect } from 'react';

function App() {
  const baseurl = "https://interviews.bigvu.tv/course/list";
  async function fetchData(url) {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`, {
        method:"GET",
        headers: {
          'Content-Type':'application/json',
          'Authorization': 'Basic ' + btoa('bigvu' + ':' + 'interview'), 
        }
    });
    const data = await response.json();
    console.log(data);
  };

  
  

    

    
  
  useEffect(() =>  {
    fetchData(baseurl);
  }, []);
  return (
    <div className="App">
      
    </div>
  );
}

export default App;

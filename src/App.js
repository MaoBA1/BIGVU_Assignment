import './App.css';
import { useEffect } from 'react';

function App() {
  const fetchApi = async() => {
    try{ 
      const response = await fetch("https://interviews.bigvu.tv/course/list", {
        method:"GET",
        // mode:"no-cors",
        headers: {
          // 'Content-Type':'application/json',
          // 'Access-Control-Allow-Origin':'*',
          // 'Access-Control-Allow-Methods':'GET,POST,OPTIONS,DELETE,PUT',
          'Authorization': `Basic' + ${btoa("bigvu" + ":" + "interview")}`,  
        },
        
      });
      // const data = await response.json();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    

    
  }
  useEffect(() =>  {
    fetchApi();
  }, []);
  return (
    <div className="App">
      
    </div>
  );
}

export default App;

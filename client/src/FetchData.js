export default async function fetchData(url) {
    const response = await fetch(`${url}`, {
        method:"GET",
        headers: {
            // 'Content-Type':'application/json',
            // eslint-disable-next-line
            'Authorization': 'Basic ' + btoa('bigvu' + ':' + 'interview'), 
        }
    });
    const data = await response.json();
    return data;
};


//https://cors-anywhere.herokuapp.com/

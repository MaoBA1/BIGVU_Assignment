export default async function fetchData(url) {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`, {
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


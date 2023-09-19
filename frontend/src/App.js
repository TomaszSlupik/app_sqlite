import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')


  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };


  const handleSaveClick = async () => {
    try {
      const response = await fetch('http://localhost:8000/saveUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Dodaj nagłówek Content-Type
        },
        body: JSON.stringify({ name, email }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Użytkownik został zapisany do bazy danych:', data);
    } catch (error) {
      console.error('Błąd podczas zapisywania użytkownika:', error);
    }
  };


  // Odczyt danych:
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/getUsers');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data); // Ustaw dane w stanie komponentu
        console.log(data); // Sprawdź, czy dane są poprawne
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
      }
    }
  
    fetchData();
  }, []);


  return (
    <div className="App">
     Testowanie:
      <input type='text' name='name' value={name} onChange={handleNameChange}/>
      <input type='email' name='email' value={email} onChange={handleEmailChange}/>
      <button
      onClick={handleSaveClick}
      >Zapisz do bazy</button>
      
      Wynik:
      
        {/* <ul>
        {users.map((user) => (
          <li>
            <strong>Imię:</strong> {user.name}, <strong>Email:</strong> {user.email}
          </li>
        ))}
      </ul> */}
      
      
    </div>
  );
}

export default App;

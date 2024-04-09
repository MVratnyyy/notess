import React, { useState, useEffect } from 'react';
import './App.css'; // Pokud tento soubor neexistuje, tento řádek zakomentuj

function App() {
  const [poznamky, setPoznamky] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  // Načítání poznámek z localStorage při prvním načtení stránky
  useEffect(() => {
    const ulozenePoznamky = JSON.parse(localStorage.getItem('poznamky'));
    if (ulozenePoznamky) {
      setPoznamky(ulozenePoznamky);
    }
  }, []);

  // Přidání nové poznámky
  const pridejPoznamku = (e) => {
    e.preventDefault();
    const text = e.target.elements.poznamka.value;
    if (!text.trim()) return;
    const novaPoznamka = { id: Date.now(), text };
    const novePoznamky = [...poznamky, novaPoznamka];
    setPoznamky(novePoznamky);
    localStorage.setItem('poznamky', JSON.stringify(novePoznamky));
    e.target.reset();
  };

  // Mazání poznámky
  const smazPoznamku = (id) => {
    const aktualizovanePoznamky = poznamky.filter(poznamka => poznamka.id !== id);
    setPoznamky(aktualizovanePoznamky);
    localStorage.setItem('poznamky', JSON.stringify(aktualizovanePoznamky));
  };

  // Začátek úpravy poznámky
  const zacniUpravu = (id) => {
    setEditId(id);
    const upravovanaPoznamka = poznamky.find(poznamka => poznamka.id === id);
    setEditText(upravovanaPoznamka.text);
  };

  // Uložení upravené poznámky
  const upravPoznamku = (e) => {
    e.preventDefault();
    const upravenePoznamky = poznamky.map(poznamka => {
      if (poznamka.id === editId) {
        return { ...poznamka, text: editText };
      }
      return poznamka;
    });
    setPoznamky(upravenePoznamky);
    localStorage.setItem('poznamky', JSON.stringify(upravenePoznamky));
    setEditId(null);
    setEditText('');
  };

  return (
    <div className="App">
      <h1>Poznámkový blok</h1>
      <form onSubmit={pridejPoznamku}>
        <input name="poznamka" type="text" placeholder="Přidej poznámku" required />
        <button type="submit">Přidat</button>
      </form>
      {editId && (
        <form onSubmit={upravPoznamku}>
          <input value={editText} onChange={(e) => setEditText(e.target.value)} type="text" required />
          <button type="submit">Uložit úpravu</button>
        </form>
      )}
      <ul>
        {poznamky.map(poznamka => (
          <li key={poznamka.id}>
            {poznamka.text}
            <button onClick={() => zacniUpravu(poznamka.id)}>Upravit</button>
            <button onClick={() => smazPoznamku(poznamka.id)}>Smazat</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

import { useState } from "react";

const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: false },
];


export default function App(){
  const [items, setItems] = useState(initialItems);
  function handleAddItem(item) {
    setItems((items) => [...items, item]);
  }

  function handleDeleteItem(id){
    setItems((items) => items.filter( (item) => item.id !== id));
  }

  function handleToggleItem(id){
    setItems((items) => items.map((item) => item.id === id ? {...item , packed: !item.packed} : item))
  }

  function onClearList(){
    const confirmed = window.confirm('Are you sure you want to delete all items?');
    if(confirmed) setItems([]);
  }

  return(
    <div className="app">
      <Logo />
      <Form onAddItem={handleAddItem} />
      <PackingList items={items} onDeleteItem={handleDeleteItem} onToggleItem = {handleToggleItem} onClearList={onClearList}/>
      <Stats items={items} />
    </div>
  )
}

function Logo(){
  return <h1>🏝️ Far Away 🧳</h1>
}


function Form({onAddItem}){
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState('');
  function handleSubmit(e){
    e.preventDefault();
    if(!description) return;
    const newItem = {id: Date.now(), description, quantity, packed: false,}
    onAddItem(newItem);
    setDescription('');
    setQuantity(1);

  }
  return <form className="add-form" onSubmit={handleSubmit}> 
    <h3>What do you need for your 😍 trip?</h3>
    <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
      {Array.from({length : 20}, (_, i ) => i+1).map((num) => (<option value={num}>{num}</option>))}
    </select>
    <input type="text" placeholder="Item..." value={description} onChange={(e)=> setDescription(e.target.value)} />
    <button>Add</button>
  </form>
}


function PackingList({items, onDeleteItem, onToggleItem, onClearList }){
  const [sortBy, setSortBy] = useState("input");
  let sortedItems;
  if(sortBy === "input") sortedItems = items;
  if(sortBy === "description") sortedItems = items.slice().sort((a, b) => a.description.localeCompare(b.description));
  if(sortBy === "packed") sortedItems = items.slice().sort((a, b) => Number(a.packed) - Number(b.packed));

  return <div className="list">
    <ul>
    {sortedItems.map((item) => <Item item={item} key={item.id} onDeleteItem={onDeleteItem} onToggleItem={onToggleItem} />)}
    </ul>

    <div className="actions">
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="input">sort by input order</option>
        <option value="description">sort by description</option>
        <option value="packed">sort by packed statues</option>
      </select>
      <button onClick={onClearList}>Clear List</button>
    </div>
  </div>
}



function Item({item, onDeleteItem, onToggleItem }){
  return(
    <li>
      <input type="checkbox" value={item.packed} onChange={()=> onToggleItem (item.id)} />
      <span style={item.packed ? {textDecoration: "line-through"} : {}}> {item.quantity} {item.description} </span>
      <button onClick={()=> onDeleteItem(item.id)}>❌</button>
    </li>
  )
}


function Stats({items}){
  if(!items.length)
    return(
      <p className="stats">
        <em>Start adding some items to your packing list 🚀</em>
      </p>
  );
  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);
  return (
  <footer className="stats">
    <em>
    💼 You have {numItems} items on your list, and you already packed {numPacked} ({percentage}%) .
    </em>
  </footer>);
}
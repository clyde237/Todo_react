import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import { Construction } from "lucide-react";

type Priority = 'Basse' | 'Moyenne' | 'Urgente';  

type Todo = {
  id: number;
  text : string;
  priority : Priority
}

function App() {
  // Utilisation des hooks State pour gerer le changement d'etat des variables
  const [input, setInput] = useState("")
  const [priority, setPriority] = useState<Priority>('Basse')

  // on liste les taches qui existent deja dans le tableau avec le local storage
  const savedTodos = localStorage.getItem("todos")
  const initialTodos = savedTodos ? JSON.parse(savedTodos) : []
  const [todos, setTodos] = useState<Todo[]>(initialTodos)

  const [filter, setFilter] = useState<'Tous' | Priority>('Tous')

  //mettre à jour les taches automatiquement avec les useEffect
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  function addTodo() {
    // verifions que le contenu de l'input n'est pas vide
    if (input.trim() === ""){
      return
    }

    // creation d'une nouvelle tache sous  format json
    const newTodo: Todo = {
      id: Date.now(), // utilisation du timestamp comme identifiant unique
      text: input.trim(),
      priority: priority
    }

    // mise a jour de la liste des taches en ajoutant la nouvelle tache
    const newTodos = [newTodo, ...todos]
    setTodos(newTodos)

    // reinitialisation de l'input et de la priorité
    setInput("")
    setPriority('Basse')
    console.log(newTodos)
  }

  let filteredTodos : Todo[] = []
  
  if (filter === 'Tous'){
    filteredTodos = todos
  } else {
    filteredTodos = todos.filter((todo) => todo.priority === filter)
  }

  const urgenteCount = todos.filter((todo) => todo.priority === 'Urgente').length
  const moyenneCount = todos.filter((todo) => todo.priority === 'Moyenne').length
  const basseCount = todos.filter((todo) => todo.priority === 'Basse').length
  const totalCount = todos.length

  function deleteTodo (id:number) {
      const newTodos = todos.filter((todo) => todo.id !==id )
      setTodos(newTodos)
  }

  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set())

  function toggleSelectedTodo(id: number){
    const newSelected = new Set(selectedTodos)
    if(newSelected.has(id)){
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedTodos(newSelected)
  }

  function finishedSelected () {
    const newTodos = todos.filter((todo) => {
      if(selectedTodos.has(todo.id)){
        return false
      } else {
        return true
      }
    })

    setTodos(newTodos)
    setSelectedTodos(new Set())
  }

  return (
    <div className="flex justify-center">
      <div className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2xl">
        <div className="flex gap-4">
          <input type="text" 
          className="input w-full" 
          placeholder="Ajouter une tâche..." 
          value={input}
          onChange={(e) => setInput(e.target.value)} // Met a jour la valeur de l'input a chaque changement
          />

          <select className="select w-full" 
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)} // Met a jour la priorité a chaque changement
          >
            <option value="Basse">Basse</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Urgente">Urgente</option>
          </select>

          <button className="btn btn-primary" onClick={addTodo}>
            Ajouter
          </button>
        </div>

        <div className="space-y-2 flex-1 h-fit">
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-4">
            <button className={`btn btn-soft ${filter === 'Tous' ? 'btn-primary' : ''}`} 
            onClick={() => setFilter('Tous')}>
              Tous
              <span className={`badge badge-sm ${filter === 'Tous' ? 'badge-primary' : ''} ml-2`}>
                {totalCount}
              </span>
            </button>
            <button className={`btn btn-soft ${filter === 'Basse' ? 'btn-primary' : ''}`} 
            onClick={() => setFilter('Basse')}>
              Basse
              <span className={`badge badge-sm ${filter === 'Basse' ? 'badge-primary' : ''} ml-2`}>
                {basseCount}
              </span>
            </button>
            <button className={`btn btn-soft ${filter === 'Moyenne' ? 'btn-primary' : ''}`} 
            onClick={() => setFilter('Moyenne')}>
              Moyenne
              <span className={`badge badge-sm ${filter === 'Moyenne' ? 'badge-primary' : ''} ml-2`}>
                {moyenneCount}
              </span>
            </button>
            <button className={`btn btn-soft ${filter === 'Urgente' ? 'btn-primary' : ''}`} 
            onClick={() => setFilter('Urgente')}>
              Urgente
              <span className={`badge badge-sm ${filter === 'Urgente' ? 'badge-primary' : ''} ml-2`}>
                {urgenteCount}
              </span>
            </button>
          </div>
          <button className="btn btn-primary"
          disabled = {selectedTodos.size === 0}
          onClick={finishedSelected}
          >
              Finir la selection ({selectedTodos.size})
            </button>
          </div>
          
          {filteredTodos.length > 0 ? (
            <ul className="divide-y divide-primary/20">
              {filteredTodos.map((todo) => (
                <li key={todo.id}>
                  <TodoItem 
                  todo={todo}
                  isSelected = {selectedTodos.has(todo.id)}
                  onDelete={() => deleteTodo(todo.id)}
                  onToggleSelect = {toggleSelectedTodo}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex justify-center items-center flex-col p-5">
              <div>
                <Construction className="w-40 h-40 text-primary" strokeWidth={1}/>
                <p className="text-sm">Aucune tâches trouvés</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

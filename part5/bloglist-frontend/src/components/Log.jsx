const Log = ({name, exit}) =>(
    <div>
      {name} loged in <button onClick={exit}>Logout</button>
    </div>
  )

  export default Log
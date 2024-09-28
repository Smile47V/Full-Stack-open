const Header = ({course}) => (
    <h1>{course}</h1>
  )
  
  const Total = ({total}) => (
    <div>Total of {total} exercises</div>
  )
const Course = ({course}) => {
  
    const total = course[0].parts.reduce((acc, cur) => acc + cur.exercises, 0);
    const totalA = course[1].parts.reduce((acc, cur) => acc + cur.exercises, 0);
  
    return(
    <div>
      <Header course={course[0].name} />
      {course[0].parts.map(part => <div key={part.id}>{part.name} {part.exercises}</div>)}
      <Total total={total}/>
  
      <Header course={course[1].name} />
      {course[1].parts.map(part => <div key={part.id}>{part.name} {part.exercises}</div>)}
      <Total total={totalA}/>
    </div>
      
  )}

  export default Course
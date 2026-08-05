
import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import Input from '../components/form/Input'
import Select from './form/Select'
import TextArea from './form/TextArea'
import CheckBox from './form/Checkbox'

const EditMovie = () => {
    const navigate = useNavigate()
    const { jwtToken } = useOutletContext()
    const [error, setError] = useState(null)
    const [errors, setErrors] = useState([])

    const [movie, setMovie] = useState({
        id:0,
        title:'',
        release_date:'',
        runtime:'',
        mpaa_rating:'',
        description:'',
        genres:[],
        genres_array:[Array(13).fill(false)],
    })

    let { id } = useParams()
    if (id === undefined) {
        id = 0
    }

    useEffect(() => {
        if(!jwtToken) {
            navigate('/login')
            return
        }
        if (id === 0) {
            setMovie({
                id:0,
                title:'',
                release_date:'',
                runtime:'',
                mpaa_rating:'',
                description:'',
                genres:[],
                genres_array:[],
            })
            const headers = new Headers()
            headers.append("Content-Type", "application/json")

            const requestOptions = {
                method: "GET",
                headers: headers,
            }
            fetch(`http://localhost:8080/genres`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    const checks=[]
                    data.forEach((g) => {
                        checks.push({id: g.id, genre: g.genre, checked: false})
                    })
                    setMovie((prevState) => ({
                        ...prevState,
                        genres: checks,
                    }))
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
          
        }

    }, [jwtToken, navigate, id])
    const handleSubmit = (e) => {
        e.preventDefault()
    }
    const handleChange = () => (event) => {
        const name = event.target.name
        setMovie({ ...movie, [name]: event.target.value })
    }

    const handleCheck = (event, position) => {
        let tmpArr = [...movie.genres]
        tmpArr[position].checked = !tmpArr[position].checked

        let tmpIds = movie.genres_array;
        if (!event.target.checked) {
            tmpIds = tmpIds.filter((id) => id !== event.target.value)
        }else {
            tmpIds.push(parseInt(event.target.value))
        }

        setMovie({ ...movie, genres_array: tmpIds})
    }

    const hasError = (key) => {
        return errors.indexOf(key) !== -1
    }

    const mpaaOptions = [
        {id:'G', value:'G'},
        {id:'PG', value:'PG'},
        {id:'PG13', value:'PG13'},
        {id:'R', value:'R'},
        {id:'NC17', value:'NC17'},
    ]

    return (
       <div>
            <h2>Add / Edit Movie</h2>
            <hr/>
            <pre>{JSON.stringify(movie, null, 3)}</pre>
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="id" value={movie.id} id="id" />
                
                <Input
                    title={"Title"}
                    className={"form-control"}
                    type={"text"}
                    name={"title"}
                    value={movie.title}
                    onChange={handleChange("title")}
                    errorDiv={hasError("title") ? "text-danger" : "d-none"}
                    errorMsg={"Please enter a title"}
                ></Input>

                <Input
                    title={"Release Date"}
                    className={"form-control"}
                    type="date"
                    name={"release_date"}
                    value={movie.release_date}
                    onChange={handleChange("release_date")}
                    errorDiv={hasError("release_date") ? "text-danger" : "d-none"}
                    errorMsg={"Please enter a release date"}
                ></Input>

                <Input
                    title={"Runtime"}
                    className={"form-control"}
                    type="number"
                    name={"runtime"}
                    value={movie.runtime}
                    onChange={handleChange("runtime")}
                    errorDiv={hasError("runtime") ? "text-danger" : "d-none"}
                    errorMsg={"Please enter a runtime"}
                ></Input>
                <Select
                    title={"MPAA Rating"}
                    name={"mpaa_rating"}
                    value={movie.mpaa_rating}
                    onChange={handleChange("mpaa_rating")}
                    options={mpaaOptions}
                    placeholder={"Choose..."}
                    errorDiv={hasError("mpaa_rating") ? "text-danger" : "d-none"}
                    errorMessage={"Please choose a rating"}
                ></Select>

                <TextArea
                    title={"Description"}
                    name={"description"}
                    rows={3}
                    onChange={handleChange("description")}
                    errorDiv={hasError("description") ? "text-danger" : "d-none"}
                    errorMessage={"Please enter a description"}
                ></TextArea>

                <hr/>
                <h3>Genres</h3>
                {
                    movie.genres && movie.genres.length>0 &&
                    <>
                        {
                            Array.from(movie.genres).map((g,index)=> (
                                <CheckBox
                                    key={index}
                                    title={g.genre}
                                    name={`genre`}
                                    id={`genre-`+index}
                                    checked={movie.genres[index].checked}
                                    onChange={(event)=>handleCheck(event,index)}
                                    value={g.id}
                                />
                            ))
                        }
                    </>
                }
            </form>
        </div>
    )
}

export default EditMovie
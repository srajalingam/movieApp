
import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import Input from '../components/form/Input'
import Select from './form/Select'
import TextArea from './form/TextArea'

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
    })

    let { id } = useParams()

    useEffect(() => {
        if(!jwtToken) {
            navigate('/login')
            return
        }

    }, [jwtToken, navigate])
    const handleSubmit = (e) => {
        e.preventDefault()
    }
    const handleChange = () => (event) => {
        const name = event.target.name
        setMovie({ ...movie, [name]: event.target.value })
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
            </form>
        </div>
    )
}

export default EditMovie
import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

const ManageCatalogue=()=>{
   const [movies,setMovies]=useState([]);

   const {jwtToken} = useOutletContext()
   const navigate = useNavigate()

    useEffect(()=>{
        if(jwtToken === ""){
            navigate("/login")
            return
        }
        const headers = new Headers();
        headers.append("content-type", "application/json");
        headers.append("Authorization","Bearer "+jwtToken)

        const requestOptions = {
            method: "GET",
            headers: headers
        };

        fetch(`http://localhost:8080/admin/movies`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setMovies(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                console.log(err);
                setMovies([]);
            });
    }, []);

    return(
       <div>
            <h2>Movies</h2>
            <hr/>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Movie</th>
                        <th>Release Date</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        movies.map((m)=>(
                            <tr key={m.id}>
                                <td>
                                    <Link to={`/movies/${m.id}`}>
                                        {m.title}
                                    </Link>
                                </td>
                                <td>{m.release_data}</td>
                                <td>{m.mpaa_rating}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ManageCatalogue
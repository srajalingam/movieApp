const CheckBox=(props)=>{
    return(
        <div className="mb-3 form-check">
            <input
                className="form-check-input"
                type="checkbox"
                id={props.name}
                name={props.name}
                onChange={props.onChange}
                value={props.value}
                checked={props.checked}
            />
            <label className="form-check-label" htmlFor={props.name}>
                {props.title}
            </label>
        </div>
    )
}

export default CheckBox
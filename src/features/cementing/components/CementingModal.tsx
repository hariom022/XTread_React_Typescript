import { useEffect,useState } from "react";
import { RingLoader } from "react-spinners";
import cementingService from "../service/cementingService";

const CementingModal=({
item,
onClose,
onSuccess
}:any)=>{

const[saving,setSaving]=useState(false);

const[cementTypes,setCementTypes]=useState([]);

const[selected,setSelected]=useState("");

useEffect(()=>{

loadTypes();

},[]);

const loadTypes=async()=>{

const res=await cementingService.getCementTypes();

setCementTypes(res.data.data);

};

const save=async()=>{

if(!selected){

alert("Select Cement Type");

return;

}

try{

setSaving(true);

await cementingService.saveCementing({

orderCasingId:item.id,

cementTypeId:selected

});

await cementingService.approveCementing({

orderCasingIds:[item.id]

});

await onSuccess();

alert("Saved Successfully");

onClose();

}
finally{

setSaving(false);

}

};

return(

<>

{saving&&(

<div
className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
style={{
background:"rgba(0,0,0,.4)",
zIndex:99999
}}
>

<RingLoader
color="#d71920"
size={80}
/>

</div>

)}

<div
className="modal fade show"
style={{
display:"block",
background:"rgba(0,0,0,.5)"
}}
>

<div className="modal-dialog modal-xl modal-dialog-centered">

<div className="modal-content">

<div className="modal-header nail-header">

<h4>

CEMENTING – INSPECTION

</h4>

<div className="ms-auto text-white fw-bold">

John

</div>

<button
className="btn-close btn-close-white"
onClick={onClose}
/>

</div>

<div className="modal-body">

<div className="modal-info">

<div>

<strong>Casing No</strong>

<div>{item.casing}</div>

</div>

<div>

<strong>Serial No</strong>

<div>{item.serial}</div>

</div>

<div>

<strong>Pattern</strong>

<div>{item.patternName}</div>

</div>

<div>

<strong>Tyre Size</strong>

<div>{item.tyreSize}</div>

</div>

<div>

<strong>Service</strong>

<div>{item.service}</div>

</div>

</div>

<hr/>

<div className="row mt-3">

<div className="col-md-4">

<label>

Cement Type

</label>

<select
className="form-select"
value={selected}
onChange={(e)=>setSelected(e.target.value)}
>

<option>

Select Cement Type

</option>

{

cementTypes.map((x:any)=>(

<option
key={x.cementTypeId}
value={x.cementTypeId}
>

{x.name}

</option>

))

}

</select>

</div>

<div className="col-md-3 d-flex align-items-end">

<button
className="btn btn-success w-100"
onClick={save}
>

Save

</button>

</div>

</div>

</div>

</div>

</div>

</div>

</>

);

};

export default CementingModal;
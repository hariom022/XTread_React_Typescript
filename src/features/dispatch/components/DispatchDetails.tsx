// import type { DispatchFinalizationRow } from "../type/dispatch.types";

// interface Props {
//     show: boolean;
//     row: DispatchFinalizationRow | null;
//     onClose: () => void;
// }

// const DispatchDetails = ({
//     show,
//     row,
//     onClose,
// }: Props) => {

//     if (!show || !row) return null;

//     return (
//         <>
//             <div className="modal fade show d-block">

//                 <div className="modal-dialog modal-xl modal-dialog-centered">

//                     <div className="modal-content">

//                         <div className="modal-header">

//                             <h5 className="modal-title text-white">
//                                 Dispatch Details
//                             </h5>

//                             <button
//                                 className="btn-close btn-close-white"
//                                 onClick={onClose}
//                             />

//                         </div>

//                         <div className="modal-body">

//                             <h4>
//                                 Delivery No :
//                                 <strong>
//                                     {" "}
//                                     {row.deliveryNo}
//                                 </strong>
//                             </h4>

//                             <div className="table-responsive mt-3">

//                                 <table className="table table-bordered">

//                                     <thead className="bg-new">

//                                         <tr>

//                                             <th>Casing No</th>

//                                             <th>Service</th>

//                                             <th>Serial No</th>

//                                             <th>Size</th>

//                                         </tr>

//                                     </thead>

//                                     <tbody>

//                                         {row.casings.map((item, index) => (

//                                             <tr key={index}>

//                                                 <td>{item.casing}</td>

//                                                 <td>{item.service}</td>

//                                                 <td>{item.serial}</td>

//                                                 <td>{item.size}</td>

//                                             </tr>

//                                         ))}

//                                     </tbody>

//                                 </table>

//                             </div>

//                         </div>

//                         <div className="modal-footer">

//                             <button
//                                 className="btn btn-secondary"
//                                 onClick={onClose}
//                             >
//                                 Close
//                             </button>

//                         </div>

//                     </div>

//                 </div>

//             </div>

//             <div className="modal-backdrop fade show"></div>
//         </>
//     );
// };

// export default DispatchDetails;
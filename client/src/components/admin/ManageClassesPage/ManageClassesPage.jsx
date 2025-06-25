// // ManageClassesPage.jsx

// import { useState, useEffect } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import AddClassForm from "./AddClassForm";
// import ClassSearch from "./ClassSearch";
// import ParticipantsList from "./ParticipantsList";
// import DeleteClassModal from "./DeleteClassModal";
// import styles from "./ManageClassesPage.module.css";

// const ManageClassesPage = () => {
//     const [searchParams, setSearchParams] = useSearchParams();
//     const navigate = useNavigate();

//     const [selectedClass, setSelectedClass] = useState(null);
//     const [participantsOpen, setParticipantsOpen] = useState(false);
//     const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

//     useEffect(() => {
//         const id = searchParams.get("classId");
//         const view = searchParams.get("view");
//         const title = searchParams.get("title");

//         if (id && view) {
//             setSelectedClass({ id, title });
//             setParticipantsOpen(view === "participants");
//             setConfirmDeleteOpen(view === "delete");
//         } else {
//             setSelectedClass(null);
//             setParticipantsOpen(false);
//             setConfirmDeleteOpen(false);
//         }
//     }, [searchParams]);

//     const closeModals = () => {
//         setSearchParams({});
//     };

//     const openParticipantsModal = (classData) => {
//         setSearchParams({ classId: classData.id, view: "participants", title: classData.title });
//     };

//     const openDeleteModal = (classData) => {
//         setSearchParams({ classId: classData.id, view: "delete", title: classData.title });
//     };

//     return (
//         <div className={styles.container}>
//             <AddClassForm />
//             <ClassSearch
//                 openParticipantsModal={openParticipantsModal}
//                 openDeleteModal={openDeleteModal}
//             />
//             {participantsOpen && selectedClass && (
//                 <div className={styles.modalOverlay}>
//                     <div className={styles.modalContent}>
//                         <ParticipantsList
//                             classId={selectedClass.id}
//                             title={selectedClass.title}
//                             onClose={closeModals}
//                         />
//                     </div>
//                 </div>
//             )}

//             {confirmDeleteOpen && selectedClass && (
//                 <DeleteClassModal
//                     classData={selectedClass}
//                     onClose={closeModals}
//                     onDeleteSuccess={() => {
//                         closeModals();
//                         setSelectedClass(null);
//                     }}
//                 />
//             )}
//         </div>
//     );
// };

// export default ManageClassesPage;
// ManageClassesPage.jsx
// ManageClassesPage.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AddClassForm from "./AddClassForm";
import ClassSearch from "./ClassSearch";
import ParticipantsList from "./ParticipantsList";
import DeleteClassModal from "./DeleteClassModal";
import styles from "./ManageClassesPage.module.css";

const ManageClassesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedClass, setSelectedClass] = useState(null);
    const [participantsOpen, setParticipantsOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const id = searchParams.get("classId");
        const view = searchParams.get("view");
        const title = searchParams.get("title"); 
        if (id && view) {
            setSelectedClass({ id, title });
            setParticipantsOpen(view === "participants");
            setConfirmDeleteOpen(view === "delete");
        } else {
            setSelectedClass(null);
            setParticipantsOpen(false);
            setConfirmDeleteOpen(false);
        }
    }, [searchParams]);
    
    const closeModals = () => {
        setSearchParams({});
    };

    const openParticipantsModal = (classData) => {
        setSearchParams({ classId: classData.id, view: "participants", title: classData.title });
    };

    const openDeleteModal = (classData) => {
        setSearchParams({ classId: classData.id, view: "delete", title: classData.title });
    };

    // פונקציה לרענון הרשימה אחרי שינויים
    const refreshClasses = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className={styles.container}>
            <AddClassForm onClassAdded={refreshClasses} />
            <ClassSearch
                openParticipantsModal={openParticipantsModal}
                openDeleteModal={openDeleteModal}
                refreshKey={refreshKey}
            />
            
            {participantsOpen && selectedClass && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <ParticipantsList
                            classId={selectedClass.id}
                            title={selectedClass.title}
                            onClose={closeModals}
                        />
                    </div>
                </div>
            )}

            {confirmDeleteOpen && selectedClass && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <DeleteClassModal
                            classData={selectedClass}
                            onClose={closeModals}
                            onDeleteSuccess={() => {
                                closeModals();
                                setSelectedClass(null);
                                refreshClasses(); // רענון הרשימה אחרי מחיקה
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageClassesPage;
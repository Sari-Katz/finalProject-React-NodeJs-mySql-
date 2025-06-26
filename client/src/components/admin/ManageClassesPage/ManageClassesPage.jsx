import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AddClassForm from "./AddClassForm/AddClassForm";
import ClassSearch from "./ClassSearch/ClassSearch";
import ParticipantsList from "./ParticipantsList";
import DeleteClassModal from "./DeleteClassModal";
import styles from "./ManageClassesPage.module.css";

const ManageClassesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const id = searchParams.get("classId");
    const view = searchParams.get("view");
    setParticipantsOpen(!!id && view === "participants");
    setConfirmDeleteOpen(!!id && view === "delete");
  }, [searchParams]);

  const closeModals = () => {
    setSearchParams({});
  };

  const refreshClasses = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      <AddClassForm onClassAdded={refreshClasses} />
      <ClassSearch refreshKey={refreshKey} />

      {participantsOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <ParticipantsList onClose={closeModals} />
          </div>
        </div>
      )}

      {confirmDeleteOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <DeleteClassModal
              onClose={closeModals}
              onDeleteSuccess={() => {
                closeModals();
                refreshClasses();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageClassesPage;

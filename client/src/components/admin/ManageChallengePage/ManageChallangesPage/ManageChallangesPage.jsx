import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AddChallengeForm from "../AddChallengeForm/AddChallengeForm";
import ChallengeSearch from "../ChallengeSearch/ChallengeSearch";
import CompleteChallengeList from "../CompleteChallengeList/CompleteChallengeList";
import ConfirmModal from '../../../ConfrimModal/ConfrimModal';
import ApiUtils from "../../../../utils/ApiUtils";
import styles from "./ManageChallangesPage.module.css";

const ManageChallangesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [completeChallengeOpen, setCompleteChallengeOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const id = searchParams.get("challengeId");
    const view = searchParams.get("view");
    const description = searchParams.get("description");
    if (id && view) {
      setSelectedChallenge({ id, description });
      setCompleteChallengeOpen(view === "participants");
      setConfirmDeleteOpen(view === "delete");
    } else {
      setSelectedChallenge(null);
      setCompleteChallengeOpen(false);
      setConfirmDeleteOpen(false);
    }
  }, [searchParams]);

  const closeModals = () => {
    setSearchParams({});
  };

  const refreshChallange = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedChallenge) return;
    
  setDeleting(true);
    try {
      await ApiUtils.delete(`http://localhost:3000/challenges/${selectedChallenge.id}`);
      closeModals();
      refreshChallange();
    } catch (err) {
      console.error("שגיאה במחיקת אתגר", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!deleting) {
      closeModals();
    }
  };

  return (
    <div className={styles.container}>
      <AddChallengeForm onChallengeAdded={refreshChallange} />
      <ChallengeSearch refreshKey={refreshKey} />
      
      {completeChallengeOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <CompleteChallengeList onClose={closeModals} />
          </div>
        </div>
      )}

      {confirmDeleteOpen && selectedChallenge && (
        <ConfirmModal 
          isOpen={true}
          title="האם אתה בטוח שברצונך למחוק את האתגר?"
          message={selectedChallenge.description}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
};

export default ManageChallangesPage;

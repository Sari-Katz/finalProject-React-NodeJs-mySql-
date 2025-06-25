import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AddChallengeForm from "./AddChallengeForm";
import ChallengeSearch from "./ChallengeSearch";
import CompleteChallengeList from "./CompleteChallengeList";
import DeleteChallengeModal from "./DeleteChallengeModal";
import styles from "./ManageChallangesPage.module.css";

const ManageChallangesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [completeChallengeOpen, setCompleteChallengeOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <DeleteChallengeModal
              onClose={closeModals}
              onDeleteSuccess={() => {
                closeModals();
                refreshChallange();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageChallangesPage;

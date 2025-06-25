import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AddChallengeForm from "./AddChallengeForm";
import ChallengeSearch from "./ChallengeSearch";
import CompleteChallengeList from "./CompleteChallengeList";
import styles from "./ManageChallangesPage.module.css";

const ManageChallangesPage = () => {
    
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedChallenge, setselectedChallenge] = useState(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [completeChallengeOpen, setcompleteChallengeOpen] = useState(false);

    useEffect(() => {
        const id = searchParams.get("challengeId");
        const view = searchParams.get("view");
        const description = searchParams.get("description");

        if (id && view) {
            setselectedChallenge({ id, description });
            setcompleteChallengeOpen(view === "participants");
            setConfirmDeleteOpen(view === "delete");
        } else {
            setselectedChallenge(null);
            setcompleteChallengeOpen(false);
            setConfirmDeleteOpen(false);
        }
    }, [searchParams]);

    const closeModals = () => {
        setSearchParams({});
    };

    const openDeleteModal = (classData) => {
        setSearchParams({
            classId: classData.id,
            view: "delete",
            title: classData.description,
        });
    };

    const openCompletedListModal = (challengeData) => {
        setSearchParams({
            challengeId: challengeData.id,
            view: "participants",
            description: challengeData.description,
        });
    };

    return (
        <div className={styles.container}>
            <AddChallengeForm />
            <ChallengeSearch openCompletedListModal={openCompletedListModal} />

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
                        <DeleteClassModal
                            classData={selectedChallenge}
                            onClose={closeModals}
                            onDeleteSuccess={() => {
                                closeModals();
                                setselectedChallenge(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageChallangesPage;

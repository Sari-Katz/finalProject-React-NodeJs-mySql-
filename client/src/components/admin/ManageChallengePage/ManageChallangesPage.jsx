
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AddChallengeForm from "./AddChallengeForm";
import ChallengeSearch from "./ChallengeSearch";
import CompleteChallengeList from "./CompleteChallengeList";
import styles from "./ManageChallangesPage.module.css";
const ManageChallangesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [selectedChallenge, setselectedChallenge] = useState(null);
    const [completeChallengeOpen, setcompleteChallengeOpen] = useState(false);

    useEffect(() => {
        const id = searchParams.get("challengeId");
        const view = searchParams.get("view");
        const description = searchParams.get("description");

        if (id && view) {
            setselectedChallenge({ id, description });
            setcompleteChallengeOpen(view === "participants");
        } else {
            setselectedChallenge(null);
            setcompleteChallengeOpen(false);
        }
    }, [searchParams]);

    const closeModals = () => {
        setSearchParams({});
    };

    const openCompletedListModal = (challengeData) => {
        setSearchParams({ challengeId: challengeData.id, view: "participants", description: challengeData.description });
    };

    return (
        <div className={styles.container}>
            <AddChallengeForm />
            <ChallengeSearch
                openCompletedListModal={openCompletedListModal}
            />
            {completeChallengeOpen && selectedChallenge && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <CompleteChallengeList
                            challengeId={selectedChallenge.id}
                            description={selectedChallenge.description}
                            onClose={closeModals}
                        />
                    </div>
                </div>
            )}

            
        </div>
    );
};

export default ManageChallangesPage;

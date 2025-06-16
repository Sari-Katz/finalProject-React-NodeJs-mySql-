
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AddChallengeForm from "./AddChallengeForm";
import ChallengeSearch from "./ChallengeSearch";
import ParticipantsList from "./ParticipantsList";
import styles from "./ManageChallangesPage.module.css";

const ManageChallangesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [selectedChallenge, setselectedChallenge] = useState(null);
    const [participantsOpen, setParticipantsOpen] = useState(false);

    useEffect(() => {
        const id = searchParams.get("challengeId");
        const view = searchParams.get("view");
        const description = searchParams.get("description");

        if (id && view) {
            setselectedChallenge({ id, description });
            setParticipantsOpen(view === "participants");
        } else {
            setselectedChallenge(null);
            setParticipantsOpen(false);
        }
    }, [searchParams]);

    const closeModals = () => {
        setSearchParams({});
    };

    const openParticipantsModal = (challengeData) => {
        setSearchParams({ challengeId: challengeData.id, view: "participants", description: challengeData.description });
    };

    // const openDeleteModal = (classData) => {
    //     setSearchParams({ challengeId: classData.id, view: "delete", description: classData.description });
    // };

    return (
        <div className={styles.container}>
            <AddChallengeForm />
            <ChallengeSearch
                openParticipantsModal={openParticipantsModal}
            />
            {participantsOpen && selectedChallenge && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <ParticipantsList
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

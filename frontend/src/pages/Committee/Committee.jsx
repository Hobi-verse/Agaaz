import { useState } from "react";
import "./Committee.css";
import { committeeData } from "../../data/committeeData";
import ProfileCard from "../../components/profileCard";

function ImageModal({ isOpen, imageSrc, name, onClose }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="imageModalOverlay" onClick={handleBackdropClick}>
      <div className="imageModalContent">
        <button
          className="imageModalClose"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <img src={imageSrc} alt={name} className="imageModalImg" />
        <p className="imageModalName">{name}</p>
      </div>
    </div>
  );
}

function CommitteeGroup({ title, members, className = "", onImageClick }) {
  return (
    <div className={`committeeGroup ${className}`}>
      <h2 className="groupTitle">{title}</h2>
      <div className="committeeCards">
        {members.map((member, index) => (
          <ProfileCard
            key={`${member.name}-${index}`}
            name={member.name}
            role={member.role}
            meta={member.department}
            imageSrc={member.image}
            showSocials={false}
            onImageClick={onImageClick}
          />
        ))}
      </div>
    </div>
  );
}

export default function Committee() {
  const [modalData, setModalData] = useState({
    isOpen: false,
    imageSrc: "",
    name: "",
  });

  const handleImageClick = (imageSrc, name) => {
    setModalData({ isOpen: true, imageSrc, name });
  };

  const handleCloseModal = () => {
    setModalData({ isOpen: false, imageSrc: "", name: "" });
  };

  return (
    <main className="committeePage">
      <section className="committeeSection" aria-label="Committee">
        <header className="committeeHeader">
          <h1 className="committeeTitle">{committeeData.title}</h1>
          <p className="committeeSubtitle">{committeeData.subtitle}</p>
        </header>

        <CommitteeGroup
          title={committeeData.coreCommittee.title}
          members={committeeData.coreCommittee.members}
          className="coreGroup"
          onImageClick={handleImageClick}
        />

        <CommitteeGroup
          title={committeeData.webTeam.title}
          members={committeeData.webTeam.members}
          className="webGroup"
          onImageClick={handleImageClick}
        />

        <CommitteeGroup
          title={committeeData.executiveCommittee.title}
          members={committeeData.executiveCommittee.members}
          className="executiveGroup"
          onImageClick={handleImageClick}
        />

        <CommitteeGroup
          title={committeeData.coordinationTeam.title}
          members={committeeData.coordinationTeam.members}
          className="executiveGroup"
          onImageClick={handleImageClick}
        />

        <CommitteeGroup
          title={committeeData.trainingTeam.title}
          members={committeeData.trainingTeam.members}
          className="trainingGroup"
          onImageClick={handleImageClick}
        />
      </section>

      <ImageModal
        isOpen={modalData.isOpen}
        imageSrc={modalData.imageSrc}
        name={modalData.name}
        onClose={handleCloseModal}
      />
    </main>
  );
}

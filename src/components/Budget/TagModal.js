import React from 'react';
import '../../css/TagModal.css'; // 독립적인 스타일을 위한 CSS 파일

const TagModal = ({ isOpen, onClose, onSelectTag, tags }) => {
    if (!isOpen) return null;

    return (
        <div className="tag-modal">
            <div className="tag-modal__content">
                <div className="tag-modal__header">
                    <span>태그 선택</span>
                    <button onClick={onClose}>X</button>
                </div>
                <div className="tag-modal__body">
                    {tags.map(tag => (
                        <button key={tag.value} onClick={() => onSelectTag(tag)} className="tag-modal__tag-button">
                            <img src={tag.icon} alt={tag.label} className="tag-modal__tag-icon" />
                            <span>{tag.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TagModal;

import React from "react";
import { useHistory } from "react-router";

const WriteExitConfirmModal = (props) => {
  const { setModalOn, setWriteModalOn } = props;
  const history = useHistory();
  // 취소 버튼
  const onCancelButtonHandler = () => {
    setModalOn(false);
  };
  // 삭제 버튼
  const onDeleteButtonHandler = () => {
    setModalOn(false);
    setWriteModalOn(false);
  };

  return (
    <div className="write-delete-window">
      <div className="write-delete-area">
        <div className="write-delte__top">
          <h1>게시글을 삭제하시겠어요?</h1>
          <h4>지금 나가면 변경 사항이 모두 사라집니다.</h4>
        </div>
        <div className="write-delete__bottom">
          <div className="write-delete-btn">
            <button onClick={onDeleteButtonHandler}>삭제</button>
          </div>
          <div className="write-cancle-btn">
            <button onClick={onCancelButtonHandler}>취소</button>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default WriteExitConfirmModal;

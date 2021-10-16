import React from "react";
import { useHistory } from "react-router";
import * as fnc from "../../commonFunc/CommonFunctions";
const MyPostModal = (props) => {
  const { myPostData, setMyPostModalOn } = props;
  const history = useHistory();

  const sendDeleteData = () => {
    fnc.executeQuery({
      url: "content/delete",
      data: {
        contentId: myPostData.contentId,
      },
      success: (res) => {
        alert(res.msg);
      },
      fail: (res) => {
        alert(res.data.msg);
      },
    });
  };

  const onDeleteBtnClick = () => {
    sendDeleteData();
  };

  const onCancelClick = () => {
    setMyPostModalOn(false);
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
            <button onClick={onDeleteBtnClick}>게시물 삭제</button>
          </div>
          <div className="write-cancle-btn">
            <button onClick={onCancelClick}>취소</button>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default MyPostModal;

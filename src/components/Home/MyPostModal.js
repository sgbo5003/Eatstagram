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
        setMyPostModalOn(false);
      },
      fail: (res) => {
        alert(res.data.msg);
        setMyPostModalOn(false);
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
    <div className="delete-window">
      <div className="delete-area">
        <div className="delete-btn">
          <button onClick={onDeleteBtnClick}>게시물 삭제</button>
        </div>
        <div className="delete-cancle-btn">
          <button onClick={onCancelClick}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default MyPostModal;

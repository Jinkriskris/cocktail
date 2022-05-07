import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  Box,
} from "@mui/material";

import * as Api from "../../api";
import Edit from "./Edit";
import useUserHook from "../commons/useUserHook";
import { useSnackbar } from "notistack";

//style
import { Typography } from "@material-ui/core";

function LoungeItem({ handleOpen, item, user, handleListEdit }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  /* Item */
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [link, setLink] = useState();
  // const [img, setImg] = useState();

  /* comment */
  const [comments, setComments] = useState(null);
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [targetId, setTargetId] = useState(null);

  const handleEdit = useCallback(() => {
    setIsEdit((prev) => !prev);
  }, [isEdit]);

  useEffect(async () => {
    await Api.get(`board/${item._id}`)
      .then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
        setCreatedAt(res.data.createdAt);
        //fetch image binary data
        if (res.data.data[0].data) {
          let Buffer = require("buffer/").Buffer;
          const type = res.data.data[0].type;
          let binary = Buffer.from(res.data.data[0].data);
          setLink(`data:${type};base64,${binary.toString("base64")}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(async () => {
    //fetch board Item
    await Api.get(`board/${item._id}`)
      .then((res) => {
        // fetch comment
        setComments(res.data.comment);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isAdd, isEdit]);

  return (
    <>
      <Grid container sx={{ mb: 3 }}>
        <Grid item xs>
          <Button
            onClick={() => {
              handleOpen();
            }}
            sx={{
              color: "white",
              border: "2px solid white",
              "&:hover": {
                color: "black",
                bgcolor: "white",
                border: "2px solid black",
              },
            }}
          >
            Back
          </Button>
        </Grid>
        {!(item.writer?._id === user?._id) ? (
          <></>
        ) : (
          <Grid item xs sx={{ textAlign: "right" }}>
            <Button
              onClick={() => {
                handleListEdit();
              }}
              sx={{
                mr: 1,
                color: "white",
                border: "2px solid white",
                "&:hover": {
                  color: "black",
                  bgcolor: "white",
                  border: "2px solid black",
                },
              }}
            >
              Edit
            </Button>
            <Button
              onClick={async () => {
                await Api.delete(`board/${item._id}`).catch((err) => {
                  console.log(err.response);
                  handleOpen();
                });
              }}
              sx={{
                color: "white",
                border: "2px solid white",
                "&:hover": {
                  color: "black",
                  bgcolor: "white",
                  border: "2px solid black",
                },
              }}
            >
              delete
            </Button>
          </Grid>
        )}
      </Grid>
      <Paper
        sx={{
          mb: 2,
          color: "white",
          bgcolor: "rgba(64,64,64,0.7)",
          p: 5,
          mx: "auto",
          width: "90%",
        }}
      >
        <Typography variant="h5">Title : {title}</Typography>
        <Typography variant="h5">
          IMG : <Box component="img" id="img" src={link} />
        </Typography>
        <Typography variant="h5">Content : {content}</Typography>
        <Typography variant="h5">CreatedAt : {createdAt}</Typography>
      </Paper>
      <TableContainer
        component={Paper}
        sx={{
          mb: 2,
          color: "white",
          bgcolor: "rgba(64,64,64,0.7)",
          p: 5,
          mx: "auto",
          width: "90%",
        }}
      >
        <Table size="small">
          <TableHead>Comments</TableHead>
          <TableBody>
            {comments?.map((comment, i) => {
              return (
                <TableRow
                  key={i}
                  onClick={() => {
                    setTargetId(comment._id);
                  }}
                >
                  <TableCell align="right"> {comment.content}</TableCell>
                  <TableCell align="right">{comment.writer?.name}</TableCell>
                  <TableCell align="right">
                    {!(comment.writer?._id === user?._id) ? (
                      <></>
                    ) : isEdit && comment._id === targetId ? (
                      <Edit
                        setIsEdit={handleEdit}
                        commentId={comment._id}
                        type={"edit"}
                        setTargetId={setTargetId}
                      />
                    ) : (
                      <>
                        <Button
                          onClick={(e) => {
                            handleEdit();
                          }}
                          sx={{ color: "white" }}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={async () => {
                            await Api.delComment(
                              `board/comment/${comment._id}`,
                              item._id
                            ).catch((err) => {
                              console.log(err.response);
                            });
                            await Api.get(`board/${item._id}`).then((res) => {
                              setComments(res.data.comment);
                            });
                          }}
                          sx={{ color: "white" }}
                        >
                          delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {isAdd ? (
          <Edit boardId={item._id} setIsEdit={setIsAdd} type={"add"} />
        ) : (
          <Box sx={{ textAlign: "right" }}>
            <Button
              onClick={() => {
                if (!user) {
                  enqueueSnackbar("Login Required");
                } else {
                  setIsAdd((prev) => !prev);
                }
              }}
              sx={{
                mt: 2,
                color: "white",
                border: "2px solid white",
                "&:hover": {
                  color: "black",
                  bgcolor: "white",
                  border: "2px solid black",
                },
              }}
            >
              댓글 작성
            </Button>
          </Box>
        )}
      </TableContainer>
    </>
  );
}

export default LoungeItem;

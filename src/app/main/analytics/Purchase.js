import React from "react";
import { Avatar, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import FusePageSimple from "../../../@fuse/core/FusePageSimple";
import { selectAuthRole, selectIsTeacher } from "../../auth/store/userSlice";
import { useEffect, useState } from "react";
import {
  getPurchaseValues,
  selectanalyticpurchase,
} from "../../store/Analytics/analyticPurchaseSlice";
import { MDBDataTable } from "mdbreact";
import "./style/attemptResult.css";
import moment from "moment";

const AttemptResult = () => {
  const dispatch = useDispatch();

  const user = useSelector(({ auth }) => auth.user);

  const isTeacher = useSelector(selectIsTeacher);

  const [teacher, setTeacher] = useState(isTeacher ? user.id : null);

  const analyticpurchaseResult = useSelector((state) =>
    selectanalyticpurchase(state)
  );
  const [tabelData, setTabel] = useState();
  useEffect(() => {
    let array = analyticpurchaseResult.data.map((item) => {
      let obj = {
        ...item,
        updated_at: moment(item?.updated_at).format("DD MMM YYYY"),
        test__created_at: moment(item?.test__created_at).format("DD MMM YYYY"),
      };

      return obj;
    });

    setTabel(array);
  }, [analyticpurchaseResult]);
  console.log(tabelData);
  useEffect(() => {
    fetchTests();
  }, [teacher]);

  const fetchTests = () => {
    dispatch(getPurchaseValues({ params: {} }));
  };

  let data = {
    columns: [
      {
        label: "Student Name",
        field: "user__name",
        sort: "asc",
        width: 150,
      },
      {
        label: "Test Name",
        field: "test__name",
        sort: "asc",
        width: 150,
      },
      {
        label: "Test Created",
        field: "test__created_at",
        sort: "asc",
        width: 270,
      },
      {
        label: "Amount Paid",
        field: "amount",
        sort: "asc",
        width: 200,
      },
      {
        label: "Purchase Date",
        field: "updated_at",
        sort: "asc",
        width: 270,
      },
      // {
      //   label: "Remain Attempt",
      //   field: "remain_attempt",
      //   sort: "asc",
      //   width: 100,
      // },
    ],
    rows: tabelData || [],
  };

  if (isTeacher) {
    return (
      <div>
        <FusePageSimple
          classes={{
            contentWrapper: "p-0 sm:p-24 h-full",
            content: "flex flex-col h-full",
            wrapper: "min-h-0",
          }}
          header={
            <div className="flex items-center p-24 justify-between w-full border-b-1">
              <Avatar
                src={
                  user?.image ||
                  "https://d10du6agr5zlzl.cloudfront.net/lolipop_dev/raw/stickers/default-profile-pic.jpg.webp"
                }
                className="h-48 w-48"
              />
              <Typography
                component={motion.span}
                initial={{ x: -20 }}
                animate={{ x: 0, transition: { delay: 0.2 } }}
                delay={300}
                className="hidden sm:flex text-20 mx-12"
              >
                Welcome, {user?.name}
              </Typography>
              <div className="flex-1"></div>
            </div>
          }
          content={
            <div className="flex flex-col p-24">
              <Typography className="py-12" variant="h5">
                All Tests
              </Typography>
              <MDBDataTable
                striped
                bordered
                large
                data={data}
                className="your-custom-styles"
              />
            </div>
          }
          innerScroll
        />
      </div>
    );
  } else {
    return <> </>;
  }
};

export default AttemptResult;

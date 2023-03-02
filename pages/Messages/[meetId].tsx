import React from "react"
import Layout from "../../components/Layout"
import axios from "axios"
import { useEffect, useState } from "react"
import Urls from "../../Constant/Urls"
import { useRouter } from "next/router"
const Messages = () => {
  const router = useRouter()
  const [meetData, setMeetData] = useState([]);
  console.log(meetData)
  const { meetId } = router.query
  console.log(meetId)
  useEffect(() => {
    axios.get(`${Urls.httpBaseUrl}/loadchat/${meetId}`)
      .then((response) => {
        console.log(response.data)
        setMeetData(response.data)
      }).catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <div>
      <Layout>
        <div className="mx-10">
          <h1 className="text-center my-8 text-3xl">Transcribe Messages</h1>
          <div className="flex flex-col">
            {
              meetData.map((element,index) => {
                return (
                    <div className="max-w-[75%] my-4" key={index}>
                    <span className="text-[12px]"> Date: {element.time}</span>
                    <p className="bg-[#ebebeb] text-black px-5 py-2 text-xl rounded-md
                     font-normal w-fit flex justify-between items-center gap-10">{element.text} Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora rem eveniet, voluptate accusamus nihil officia eos? Rerum facere tenetur expedita cum quidem placeat laborum a laudantium fugiat. Facilis, laboriosam qui.
                    </p>
                    </div>
                )
              })
            }
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default Messages
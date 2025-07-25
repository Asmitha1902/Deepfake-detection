import axios from "axios";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageFormProps } from "@/interfaces";

export function ImageForm({ submitForm }: ImageFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [prediction, setPrediction] = useState<string>("Unknown");
  const [framePredictions, setFramePredictions] = useState<string[]>([]);
  const [frameUrls, setFrameUrls] = useState<string[]>([]); // To store URLs of frames
  const [realPercentage, setRealPercentage] = useState<number>(0);
  const [fakePercentage, setFakePercentage] = useState<number>(0);

  // Handle video upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const videoFile = event.target.files?.[0];
    if (!videoFile) return;

    const formData = new FormData();
    formData.append("video", videoFile);

    setIsUploading(true);
    setIsUploaded(false);

    try {
      // Post the form data with the correct content-type
      const response = await axios.post("http://localhost:3000/upload-video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Server Response:", response.data);

      if (response.data) {
        const frames = response.data.frame_predictions || [];
        const frameUrls = response.data.frame_urls || [];
        const totalFrames = frames.length;
        const fakeCount = frames.filter((frame: string) => frame === "FAKE").length;
        const realCount = totalFrames - fakeCount;

        setFramePredictions(frames);
        setFrameUrls(frameUrls); // Set the frame URLs
        setPrediction(response.data.final_prediction || "Unknown");
        setRealPercentage(Number(((realCount / totalFrames) * 100).toFixed(2)));
        setFakePercentage(Number(((fakeCount / totalFrames) * 100).toFixed(2)));
        setIsUploaded(true);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      setIsUploaded(false);
    } finally {
      setIsUploading(false);
    }
  };

  // CSS for the pie chart representation
  const pieChartStyle = (percentage: number, color: string) => ({
    background: `conic-gradient(${color} ${percentage}%, #f0f0f0 ${percentage}%)`, // Corrected this line
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
  });
  

  return (
    <div
      className="flex flex-col items-center justify-center w-full min-h-screen p-6 bg-gradient-to-r from-blue-600 to-purple-600"
    >
      {/* Upload Video Section */}
      <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto mb-6">
        <Card className="w-full p-4 shadow-md border border-gray-300 rounded-md bg-white opacity-90">
          <CardHeader className="text-center text-gray-800 p-2">
            <CardTitle className="text-lg font-semibold text-blue-800">Upload Video</CardTitle>
            <CardDescription className="text-xs text-gray-600">
              Deepfake Detection
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <form>
              <div className="grid w-full items-center gap-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="video" className="text-gray-700 text-sm font-medium">
                    Choose a File
                  </Label>
                  <Input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    disabled={isUploading || isUploaded}
                    className="border border-gray-300 rounded-md p-1 text-sm text-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center p-2">
            <Button
              className="w-full bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 py-2"
              onClick={submitForm}
              disabled={isUploading || !isUploaded}
            >
              {isUploading ? "Uploading..." : "Submit"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Display "Uploading..." message once */}
      {isUploading && !isUploaded && (
        <p className="text-center text-sm text-gray-200 mt-4">Uploading...</p>
      )}

      {/* Frame-wise Breakdown Section */}
      {isUploaded && (
        <div className="w-full md:w-2/3 p-4 rounded-lg shadow-md bg-white border border-gray-300 mt-4 opacity-95">
          <h3 className="text-lg font-semibold text-blue-800 text-center mb-3">Frame-wise Breakdown</h3>

          {/* Frame Predictions Grid */}
          <div
            className="grid grid-cols-8 sm:grid-cols-10 gap-1 mt-3 max-h-[250px] overflow-y-auto p-1"
          >
            {frameUrls.map((frameUrl, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-center p-1 border rounded-sm text-xs transform transition-all hover:scale-105 ${
                  framePredictions[index] === "FAKE"
                    ? "bg-red-100 text-red-600 border-red-400"
                    : "bg-green-100 text-green-600 border-green-400"
                }`}
              >
               <img src={frameUrl} alt={`Frame-${index + 1}`} className="w-16 h-16 object-cover mb-2" />

                <span className="font-medium">Frame-{index + 1}</span>
                <span className="font-bold mt-0.5">{framePredictions[index]}</span>
              </div>
            ))}
          </div>

          {/* Final Prediction */}
          <div className="mt-4 text-center">
            <p className="text-base font-semibold text-gray-800">
              Final Prediction:{" "}
              <span className={prediction === "FAKE" ? "text-red-600" : "text-green-600"}>
                {prediction}
              </span>
            </p>
          </div>

          {/* Pie Chart for Percentage Breakdown */}
          <div className="mt-6">
            <h3 className="text-base font-semibold text-blue-800 text-center mb-3">Percentage Breakdown</h3>
            <div className="flex justify-center space-x-4">
              {/* Real Percentage */}
              <div className="text-center">
                <div
                  style={pieChartStyle(realPercentage, "#34D399")}
                  className="relative flex justify-center items-center"
                >
                  <span className="text-sm font-bold text-green-600">{realPercentage}%</span>
                </div>
                <div className="text-xs text-gray-600">Real</div>
              </div>
              {/* Fake Percentage */}
              <div className="text-center">
                <div
                  style={pieChartStyle(fakePercentage, "#F87171")}
                  className="relative flex justify-center items-center"
                >
                  <span className="text-sm font-bold text-red-600">{fakePercentage}%</span>
                </div>
                <div className="text-xs text-gray-600">Fake</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
//import the css
import "./LoadingBar.css";

export default function LoadingBar({ barColor, ...props }: any) {
  return (
    <div {...props} className={`${props.className} loading-bar`}>
      <div
        className="bar"
        style={{
          backgroundColor: barColor || "#75BF43",
        }}
      ></div>
    </div>
  );
}

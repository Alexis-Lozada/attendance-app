interface ButtonProps {
  text: string;
  onClick?: () => void;
}

export default function Button({ text, onClick }: ButtonProps) {
  return (
    <button
      type="submit"
      onClick={onClick}
      className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition"
    >
      {text}
    </button>
  );
}

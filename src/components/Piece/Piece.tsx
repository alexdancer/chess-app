import './Piece.css'

interface Props {
  // ? is for when tile is empty
  image?: string;
  number: number;
}

export default function Piece({ number, image } : Props) {
  if(number % 2 === 0) {
    return (
      // if the image != null then render the image
      <div className='tile black-tile'>
        {image && <div style={{backgroundImage: `url(${image})`}} className='chess-piece' ></div>} 
      </div>
    )
  } else {
    return (
      <div className='tile white-tile'>
        {image && <div style={{backgroundImage: `url(${image})`}} className='chess-piece' ></div>}
      </div>
    )
  }

}
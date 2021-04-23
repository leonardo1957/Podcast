import {format, parseISO } from 'date-fns'
import { GetStaticProps} from 'next'
import { api } from "../service/api";
import ptBR from  'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';


type Episode = {
  id: string;
  tittle: string;
  thumbnail: string;
  descrioption: string;
  members: string;
  duration: string;
  durationAsString: string;
  url: string;
  publishedAt: string;

}

type HomeProps = {
  episodes :Episode[]
}

export default function Home(props: HomeProps) {
  return (
    <div>
      <h1>oi</h1>
      <p>{JSON.stringify(props.episodes)}</p>
 </div>
  );
}

export const getStaticProps: GetStaticProps= async () =>{
  const {data} = await api.get('episodes', {
    params: {
              _limit:12,
             _sort:'published_at',
             _order: 'desc',
  }

  })

  const episodes = data.map(episode =>{
    return{

      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt : format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.file.description,
      url: episode.file.url,

    }
  })
  
  return{
    props:{
      episodes: episodes,
    },
    reavalidate: 60 * 60 * 8,
  }
  
}

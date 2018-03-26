
export class Article {
  serial_no: number;
  a_id: number;
  url: string;
  status: boolean;
  title: string;
  summary: string;
  photo_url: string;
  modified_date: Date;
  site_url: string;
  site_name: string;
  category: string;
  sub_category: string;
  custom: boolean;
  copied: boolean;
  shared: boolean;
  views: string;
  shares: number;
}

export class Source {
  id: string;
  name: string;
  category: string;
  picture: string;
  fan_count: number;
  rating: number;
  link: string;

  access_token: string;
  
}


export class User {
  uid: string;
  fullname: string;
  photourl: string;
  username: string;
}

export class C_Stats {
  country: string;
  sessions: number;
  newSessions: number;
}

export const DATA_API_ENDPOINT = 'http://192.168.100.17:3208/';


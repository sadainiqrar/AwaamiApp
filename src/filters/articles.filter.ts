import { Pipe, PipeTransform } from '@angular/core';

import { Article } from '../Models/models';

@Pipe({ name: 'categoryFilter' })
export class CategoryFilterPipe implements PipeTransform {
  transform(articles: Array<Article>, category: string): Array<Article> {
    let out = new Array<Article>();
    
    if (category === 'Political') {

      out = articles;
    }
    else {
      for (let article in articles) {
        if (articles[article].sub_category === category) {
          out.push(articles[article]);
        }
      } 
    }

    return out;

  }
}

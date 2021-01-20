import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { DetailsComponent } from './components/details/details.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';

const routes: Routes = [
  //
  { path: '', component: SearchbarComponent },
  { path: 'search', component: SearchbarComponent },
  {path:'details/:ticker', component:DetailsComponent},
  {path:'watchlist', component:WatchlistComponent},
  {path: 'portfolio', component:PortfolioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

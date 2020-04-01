Rails.application.routes.draw do

  # get 'plants', to: '/'
  # get 'plants/new', to: '/'
  # get 'plants/:id', to: '/'
  # get 'plants/:id/edit', to: '/'


  defaults format: :json do
    namespace :api do
      namespace :v1 do
        resources :users do
          get '/plants', to: 'plants#authorized_index'
          get '/plants/:id', to: 'plants#authorized_show'
          delete '/plants/:id', to: 'plants#destroy'
          # post '/plants', to: 'plants#create'
          patch '/plants/:id', to: 'plants#update'
        end

        # resources :plants, only: [:create, :show, :index, :update, :destroy]
        resources :plants, only: [:index, :create, :show]
      end
    end

    post :login, to: 'sessions#create'
    delete :logout, to: 'sessions#destroy'
    get :logged_in, to: 'sessions#is_logged_in?'
    
    resources :users, only: [:create, :show, :index, :update, :destroy]

    root to: redirect('/')
  
  end
  
end

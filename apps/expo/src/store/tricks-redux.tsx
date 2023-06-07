import { createSlice } from "@reduxjs/toolkit";


export type Apparatus = ["Silks", "Lyra", "Hammock", "Pole"]

const blackBookSlice = createSlice({
  name: "blackbook",
  initialState: {
    tricks: [] as Trick[],
    favorites: [] as Trick[],
    completed: [] as Trick[],
  },
  reducers: {
    //state here is changing to prevTricks
    createNewTrick: (state, action) => {
      const newItem = action.payload;
      const prevTricks = [...state.tricks];
      state = prevTricks.push(newItem);
    },
    editTrick: (state, action) => {
      const { id } = action.payload;
      const { tricks } = state;
      const index = state.tricks.findIndex((trick: Trick) => trick.id === id);
      tricks[index] = { ...action.payload };
    },
    deleteTrick: (state, action) => {
      const id = action.payload.id;
      state.tricks.splice(
        state.tricks.findIndex((trick) => trick.id === id),
        1,
      );
      let index = state.favorites.findIndex((trick) => trick.id === id);
      if (index > -1) {
        state.favorites.splice(index, 1);
      }
    },
    setTricksFromBackend: (state, action) => {
      state.tricks = [...action.payload];
      //state.tricks.push(...action.payload);
    },
    toggleFavorites: (state, action) => {
      const { favorites } = state;
      const { id } = action.payload;
      const index = favorites.findIndex((trick) => trick.id === id);

      if (index < 0) {
        action.payload.isFavorite === !action.payload.isFavorite;

        favorites.push(action.payload);
      } else if (index >= 0) {
        favorites.splice(index, 1);
      }
    },
    removeFromFavorites: (state, action) => {
      const { favorites } = state;
      let index = favorites.findIndex(function (obj) {
        return obj.id == action.payload;
      });
      if (index > -1) favorites.splice(index, 1);
    },
    setComplete: (state, action) => {
      const { favorites } = state;
      const itemId = action.payload.id;
      let index = favorites.find((trick) => trick.id === itemId);
      const { completed } = state;
      if (index) {
        index.completed = true;
        //check if its in there first then push
        const completeIndex = completed.findIndex((item) => item.id === itemId);
        if (completeIndex > -1) {
          completed[completeIndex].tally =
            completed[completeIndex].tally + 1 || 2;
        }
        if (completeIndex == -1) {
          //not calling () todatestring was returning "completeDate": [Function toISOString],
          index.completeDate = new Date().toLocaleDateString();
          completed.push(index);
        }
      }
    },
  },
});



export const sendTrickData = (trick, token: string, uId: string, apparatus: Apparatus) => {
  return async (dispatch) => {
    const sendPutRequest = async () => {
      const response = await fetch(
        `https://aerial-blackbook-default-rtdb.firebaseio.com/users/${apparatus}/${uId}/tricks.json?auth=${token}`,
        {
          method: "POST",
          body: JSON.stringify({
            trick,
          }),
        },
      ).then(dispatch(createNewTrick({ ...trick })));
      if (!response.ok) {
        throw new Error("failed to send");
      }
    };
    try {
      await sendPutRequest();
    } catch (error) {
      console.log(error);
    }
  };
};

//id set to generic then back into state from backend

export const editTrickData = (trick: Trick, token: string, uId: string, apparatus: Apparatus) => {
  const { id } = trick;

  return async (dispatch) => {
    dispatch(editTrick({ ...trick }));
    const sendPutRequest = async () => {
      const response = await fetch(
        `https://aerial-blackbook-default-rtdb.firebaseio.com/users/${apparatus}/${uId}/tricks/${id}.json?auth=${token}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trick: trick,
          }),
        },
      );
      const response2 = await response.json();
      console.log(response2);
      if (!response.ok) {
        throw new Error("sending failed");
      }
    };
    try {
      await sendPutRequest();
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteFromAll = (id: string, token: string, uId: string, apparatus: Apparatus) => {
  return async (dispatch) => {
    dispatch(deleteTrick({ id }));
    const sendDeleteRequest = async () => {
      const response = await fetch(
        `https://aerial-blackbook-default-rtdb.firebaseio.com/users/${apparatus}/${uId}/tricks/${id}.json?auth=${token}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("sending failed");
      }
    };
    try {
      await sendDeleteRequest();
    } catch (error) {
      console.log(error);
    }
  };
};

const slice = blackBookSlice.actions;

export const editTrick = slice.editTrick;
export const setComplete = slice.setComplete;
export const removeFromFavorites = slice.removeFromFavorites;
export const retrieveTricks = slice.setTricksFromBackend;
export const createNewTrick = slice.createNewTrick;
export const deleteTrick = slice.deleteTrick;
export const setTricksFromBackend = slice.setTricksFromBackend;
export const toggleFavorites = slice.toggleFavorites;
export default blackBookSlice.reducer;

# Xellanix Stylesheets and Components for React

## Install and Use
- To install this package, run this command on the terminal:
```
pnpm i xellanix-react
```

- Before using any component, you must import the default stylesheet into the first line of your `main.tsx` file or the starting point of your React application that is used for initial rendering and setup.
``` tsx
import "xellanix-react/style.css";
```

- To use the component, just import it like this:
``` tsx
import { Slider } from "xellanix-react";
```

- Add the imported component to the layout:
``` tsx
return (
    <div>
        {/* other elements */}
        
        <Slider min={0}
                max={1000}
                step={2}
                initialValue={20}
        />

        {/* other elements */}
    </div>
)
```

## Available Components
- `InfoBox`
- `PopupProvider`
- `Slider`
- `SliderInput` (slider text input for `Slider` component)
- `ToggleSwitch`

## Available Types and Enums
- `InfoStatus` (for `InfoBox` component `status`)

## Available Hooks
- `usePopup` (`PopupProvider` hook)
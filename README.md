# Xellanix Stylesheets and Components for React

## Installation and Setup
- To install this package, run this command on the terminal:
```
pnpm i xellanix-react
```

- Before using any component, you must import the default stylesheet into the first line of your `main.tsx` file or the starting point of your React application that is used for initial rendering and setup.
``` tsx
import "xellanix-react/style.css";
```

- Add the `light-theme` or `dark-theme` class in the `body` tag. 
- Add the `body-wrapper` class to the `div` tag, which is a child of the `body` tag (commonly used as the root for React), so that it looks at least like this.
- Once all the required classes have been added, it should at least look like this.
``` html
<body class="light-theme">
    <div class="body-wrapper" id="root"></div>
    <!-- OTHER SCRIPTS -->
</body>
```

## Usage
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